import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Exception } from 'utils/Exception';
import * as bcrypt from 'bcrypt';
import { LoginResponse, RegisterResponse } from 'graphql-schema';
import { LoginDto, RegisterDto } from 'users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    const user = await this.usersService.findByUsernameOrEmail(
      args.usernameOrEmail,
    );
    if (!user || !(await bcrypt.compare(args.password, user.password)))
      throw new Exception(
        HttpStatus.NOT_FOUND,
        'Email or password is incorrect',
      );
    const { password, ...withoutPassword } = user;
    return { user: withoutPassword, accessToken: this.signToken(user) };
  }

  async register(args: RegisterDto): Promise<RegisterResponse> {
    const user = await this.usersService.create(args);
    return {
      user,
      accessToken: this.signToken(user),
    };
  }
}
