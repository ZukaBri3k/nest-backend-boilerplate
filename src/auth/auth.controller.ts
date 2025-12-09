import { Body, Controller, Post } from '@nestjs/common';
import { MailjetService } from 'src/mailjet/mailjet.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailjet: MailjetService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body('email') email: string) {
    return await this.mailjet.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }
}
