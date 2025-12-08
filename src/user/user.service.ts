import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(payload: RegisterDto) {
    return this.prisma.user.create({ data: payload });
  }
}
