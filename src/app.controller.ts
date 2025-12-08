import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthGuard } from './auth/auth.guard';

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
}
