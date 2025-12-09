import { IsEmail, IsString } from 'class-validator';

export class SendResetPasswordEmailDto {
  @IsEmail()
  @IsString()
  email: string;
}
