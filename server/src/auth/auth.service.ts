import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Exception } from 'common/Exception';
import * as bcrypt from 'bcrypt';
import { LoginResponse, RegisterResponse } from 'graphql-schema';
import { LoginDto, RegisterDto, ResetPasswordDto } from 'auth/auth.dto';
import { decode } from 'common/jwt';
import { request } from 'common/graphql-request';
import { User } from '@shared/graphql';
import {
  findByEmailQuery,
  findForLoginQuery,
  getEmailConfirmationInfoByEmail,
  getResetPasswordSentAtByEmail,
  getUserIdByEmail,
  getUserIdByUsername,
  registerQuery,
  resetPassword,
  setConfirmationSentAtByEmail,
  setConfirmedAtByEmail,
  setConfirmedAtById,
  setResetPasswordSentAtByEmail,
} from 'auth/auth.queries';
import { sendConfirmationDelayMs } from 'common/constants';
import { AuthMailer } from 'auth/auth.mailer';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authMailer: AuthMailer,
    private readonly jwtService: JwtService,
  ) {}

  signToken(user: { id: number }) {
    return this.jwtService.sign({
      sub: user.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': user.id,
      },
    });
  }

  async login(args: LoginDto): Promise<LoginResponse> {
    const users = await request<{
      user: Pick<
        User,
        | 'id'
        | 'username'
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'password'
        | 'confirmedAt'
      >[];
    }>(findForLoginQuery, {
      usernameOrEmail: args.usernameOrEmail,
    });

    const user = users.user[0];
    if (!user || !(await bcrypt.compare(args.password, user.password)))
      throw new Exception(
        HttpStatus.NOT_FOUND,
        'Email or password is incorrect',
      );

    if (!user.confirmedAt)
      throw new Exception(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'You have to confirm your email address before continuing.',
      );

    const { password, confirmedAt, ...withoutPassword } = user;
    return { user: withoutPassword, accessToken: this.signToken(user) };
  }

  async register(args: RegisterDto): Promise<RegisterResponse> {
    const user = await this.create(args);
    return {
      user,
      accessToken: this.signToken(user),
    };
  }

  async verifyEmail(token: string) {
    const data = decode(token);
    if (!data || typeof data !== 'object' || typeof data.email !== 'string')
      throw new Exception(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Reset password token is invalid',
      );

    const { email } = data;

    const user = await this.findByEmail(email);
    if (!user)
      throw new Exception(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Reset password token is invalid',
      );

    await request(setConfirmedAtById, {
      id: user.id,
      confirmedAt: new Date(),
    });

    return {
      user,
      accessToken: this.signToken(user),
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await request<{ user: User[] }>(findByEmailQuery, {
      email,
    });
    return users.user[0];
  }

  async create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Omit<User, 'password'>> {
    try {
      const { password, ...withoutPassword } = user;
      const result = await request<{
        insert_user_one: { id: number; updatedAt: string; createdAt: string };
      }>(registerQuery, {
        ...withoutPassword,
        password: await encryptPassword(password),
      });

      this.authMailer.sendConfirmationInstructions(user);

      return {
        ...withoutPassword,
        ...result.insert_user_one,
      };
    } catch (error) {
      const conflictError = error.response?.errors.find(
        (error) => error.extensions.code === 'constraint-violation',
      );
      if (conflictError) {
        const columnName = conflictError.message.includes('email')
          ? 'Email'
          : 'Username';
        throw new Exception(HttpStatus.CONFLICT, `${columnName} is taken`);
      } else {
        throw error;
      }
    }
  }

  async isUsernameFree(username: string) {
    const result = await request<{ user: { id: number }[] }>(
      getUserIdByUsername,
      {
        username,
      },
    );
    return result.user.length === 0;
  }

  async isEmailFree(email: string) {
    const result = await request<{ user: { id: number }[] }>(getUserIdByEmail, {
      email,
    });
    return result.user.length === 0;
  }

  async sendEmailConfirmation(email: string) {
    const {
      user: [user],
    } = await request<{
      user: { confirmationSentAt: string; confirmedAt: string }[];
    }>(getEmailConfirmationInfoByEmail, {
      email,
    });

    if (!user)
      throw new Exception(
        HttpStatus.NOT_FOUND,
        'The email you entered does not belong to an active account.',
      );

    if (user.confirmedAt)
      throw new Exception(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Email was already confirmed, please try signing in',
      );

    const sentAt = user.confirmationSentAt;
    const now = new Date();

    if (sentAt && now.getTime() - Date.parse(sentAt) < sendConfirmationDelayMs)
      throw new Exception(HttpStatus.TOO_MANY_REQUESTS, 'Too many requests');

    await request(setConfirmationSentAtByEmail, {
      email,
      confirmationSentAt: now,
    });

    this.authMailer.sendConfirmationInstructions({ email });

    return true;
  }

  async sendResetPassword(email: string) {
    const {
      user: [user],
    } = await request<{ user: { resetPasswordSentAt: string }[] }>(
      getResetPasswordSentAtByEmail,
      {
        email,
      },
    );

    if (!user)
      throw new Exception(
        HttpStatus.NOT_FOUND,
        'The email you entered does not belong to an active account.',
      );

    const sentAt = user.resetPasswordSentAt;
    const now = new Date();

    if (sentAt && now.getTime() - Date.parse(sentAt) < sendConfirmationDelayMs)
      throw new Exception(HttpStatus.TOO_MANY_REQUESTS, 'Too many requests');

    await request(setResetPasswordSentAtByEmail, {
      email,
      resetPasswordSentAt: now,
    });

    this.authMailer.sendResetPasswordInstructions({ email });

    return true;
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const data = decode(token);
    if (!data || typeof data !== 'object' || typeof data.email !== 'string')
      throw new Exception(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'Reset password token is invalid',
      );

    const { email } = data;

    await request(setConfirmedAtByEmail, {
      email,
      confirmedAt: new Date(),
    });

    const {
      update_user: {
        returning: [user],
      },
    } = await request<{
      update_user: {
        returning: Pick<
          User,
          'id' | 'username' | 'firstName' | 'lastName' | 'email'
        >[];
      };
    }>(resetPassword, {
      email,
      password: await encryptPassword(password),
    });

    return {
      user,
      accessToken: this.signToken(user),
    };
  }
}
