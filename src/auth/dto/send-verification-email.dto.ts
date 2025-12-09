import { IsEmail, IsString } from 'class-validator';

export class sendVerificationEmailDto {
  @IsEmail()
  @IsString()
  email: string;
}
