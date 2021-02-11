import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginDto, RegisterDto } from 'users/users.dto';
import { LoginResponse, RegisterResponse } from '../graphql-schema';
import { AuthService } from 'auth/auth.service';
import { Public } from 'utils/public.decorator';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation('login')
  login(@Args('input') args: LoginDto): Promise<LoginResponse> {
    return this.authService.login(args);
  }

  @Public()
  @Mutation('register')
  async register(@Args('input') args: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(args);
  }
}
