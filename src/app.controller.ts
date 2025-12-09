import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
import { PrismaService } from './prisma/prisma.service';
import { CurrentUser } from './auth/decorators/authenticated_user.decorator';
import type { User } from 'generated/prisma/client';

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
  admin(@CurrentUser() user: User): string {
    console.log(user);
    return 'Hello Admin World';
  }
}
