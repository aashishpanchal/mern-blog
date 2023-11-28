import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  totp: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}
