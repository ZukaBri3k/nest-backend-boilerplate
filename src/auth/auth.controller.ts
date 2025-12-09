import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendResetPasswordEmailDto } from './dto/send-reset-password-email.dto';
import { sendVerificationEmailDto } from './dto/send-verification-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
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
  async sendResetPasswordEmail(@Body() payload: SendResetPasswordEmailDto) {
    const token = await this.authService.generateResetPasswordToken(
      payload.email,
    );

    return await this.mailService.sendResetPasswordEmail(payload.email, token);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body() payload: sendVerificationEmailDto) {
    const token = await this.authService.generateEmailVerificationToken(
      payload.email,
    );

    return await this.mailService.sendVerificationEmail(payload.email, token);
  }

  @Post('verify-email')
  async verifyEmail(@Body() payload: VerifyEmailDto) {
    return await this.authService.verifyEmail(payload.token);
  }
}
