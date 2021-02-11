import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@shared/graphql';
import { request } from 'utils/graphql-request';
import { Exception } from 'utils/Exception';
import * as bcrypt from 'bcrypt';
import {
  getUserIdByUsername,
  findByUsernameOrEmailQuery,
  registerQuery,
  getUserIdByEmail,
} from 'users/users.queries';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

@Injectable()
export class UsersService {
  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    const users = await request<{ user: User[] }>(findByUsernameOrEmailQuery, {
      usernameOrEmail,
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
}
