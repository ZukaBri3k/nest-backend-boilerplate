import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getHello() {
    return this.prismaService.user.create({
      data: {
        email: 'test@mail.com',
        name: 'Test User',
        password: 'test',
      },
    });
  }
}
