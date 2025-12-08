import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  verifyToken(token: string): Partial<User> | null {
    return jwt.verify(token, process.env.JWT_SECRET!) as Partial<User>;
  }
}
