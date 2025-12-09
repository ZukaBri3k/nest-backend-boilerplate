import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  token: string;

  @IsString()
  @MinLength(5)
  password: string;
}
