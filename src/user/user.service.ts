import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: UpdateUserDto = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await this.bcrypt.hash(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async createUser(payload: RegisterDto) {
    return this.prisma.user.create({ data: payload });
  }
}
