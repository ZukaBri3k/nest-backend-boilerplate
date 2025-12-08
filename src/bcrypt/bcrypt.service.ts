import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async verify(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
