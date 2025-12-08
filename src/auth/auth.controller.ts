import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }
}
