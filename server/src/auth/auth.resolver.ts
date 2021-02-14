import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginDto, RegisterDto, ResetPasswordDto } from 'auth/auth.dto';
import { LoginResponse, RegisterResponse } from 'graphql-schema';
import { AuthService } from 'auth/auth.service';
import { Public } from 'common/decorators/public.decorator';

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
  register(@Args('input') args: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(args);
  }

  @Public()
  @Mutation('verifyEmail')
  verifyEmail(@Args('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Query('isUsernameFree')
  isUsernameFree(@Args('username') username: string) {
    return this.authService.isUsernameFree(username);
  }

  @Public()
  @Query('isEmailFree')
  isEmailFree(@Args('email') username: string) {
    return this.authService.isEmailFree(username);
  }

  @Public()
  @Mutation('sendEmailConfirmation')
  sendEmailConfirmation(@Args('email') email: string) {
    return this.authService.sendEmailConfirmation(email);
  }

  @Public()
  @Mutation('sendResetPassword')
  sendResetPassword(@Args('email') email: string) {
    return this.authService.sendResetPassword(email);
  }

  @Public()
  @Mutation('resetPassword')
  resetPassword(@Args('input') input: ResetPasswordDto) {
    return this.authService.resetPassword(input);
  }
}
