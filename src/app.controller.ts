import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  public(): string {
    return 'Hello World';
  }

  @Get('/private')
  @UseGuards(AuthGuard)
  private(): string {
    return 'Hello Private World';
  }

  @Get('/admin')
  @UseGuards(AuthGuard)
  admin() {
    return 'Hello Admin World';
  }
}
