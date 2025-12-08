import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }
}
