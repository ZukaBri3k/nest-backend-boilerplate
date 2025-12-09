import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { Token, User } from 'generated/prisma/client';
import { omit } from 'lodash';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import type { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwt: JwtService,
    private readonly bcrypt: BcryptService,
    private prisma: PrismaService,
  ) {}

  async login(
    email: string,
    pass: string,
  ): Promise<Partial<User> & { token: string }> {
    let user: User;

    try {
      user = await this.usersService.findOneByEmail(email);
    } catch {
      throw new UnauthorizedException();
    }

    if (!(await this.bcrypt.verify(pass, user.password))) {
      throw new UnauthorizedException();
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const token = this.jwt.sign(user);

    return { ...(omit(user, 'password') as Partial<User>), token };
  }

  async register(
    @Body() payload: RegisterDto,
  ): Promise<Partial<User> & { token: string }> {
    const hashedPassword = await this.bcrypt.hash(payload.password);

    const user = await this.usersService.createUser({
      ...payload,
      password: hashedPassword,
    });

    const token = this.jwt.sign(user);

    return { ...(omit(user, 'password') as Partial<User>), token };
  }

  async generateResetPasswordToken(email: string): Promise<Token> {
    const user = await this.usersService.findOneByEmail(email);

    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: user.id,
        type: 'RESET_PASSWORD',
      },
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: { id: existingToken.id },
      });
    }

    const resetToken = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: 'RESET_PASSWORD',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    return resetToken;
  }

  async generateEmailVerificationToken(email: string): Promise<Token> {
    const user = await this.usersService.findOneByEmail(email);

    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
      },
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: { id: existingToken.id },
      });
    }

    const verificationToken = await this.prisma.token.create({
      data: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    return verificationToken;
  }

  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const token = await this.prisma.token.findUnique({
      where: { id: payload.token },
    });

    if (!token || token.type !== 'RESET_PASSWORD') {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Reset token has expired');
    }

    const hashedPassword = await this.bcrypt.hash(payload.password);

    await this.prisma.user.update({
      where: { id: token.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.token.delete({
      where: { id: token.id },
    });

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(tokenId: string): Promise<{ message: string }> {
    const token = await this.prisma.token.findUnique({
      where: { id: tokenId },
    });

    if (!token || token.type !== 'EMAIL_VERIFICATION') {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Verification token has expired');
    }

    await this.prisma.user.update({
      where: { id: token.userId },
      data: { isEmailVerified: true },
    });

    await this.prisma.token.delete({
      where: { id: token.id },
    });

    return { message: 'Email has been verified successfully' };
  }
}
