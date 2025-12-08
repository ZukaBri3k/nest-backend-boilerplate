import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { omit } from 'lodash';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwt: JwtService,
    private readonly bcrypt: BcryptService,
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

    const token = this.jwt.generateToken(user);

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

    const token = this.jwt.generateToken(user);

    return { ...(omit(user, 'password') as Partial<User>), token };
  }
}
