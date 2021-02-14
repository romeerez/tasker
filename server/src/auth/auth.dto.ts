import { MinLength, IsEmail, IsNotEmpty } from 'class-validator';
import { LoginInput, RegisterInput, ResetPasswordInput } from 'graphql-schema';

export class LoginDto extends LoginInput {
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterDto extends RegisterInput {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class ResetPasswordDto extends ResetPasswordInput {
  @IsNotEmpty()
  token: string;

  @MinLength(6)
  password: string;
}
