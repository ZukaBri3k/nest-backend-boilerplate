import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Token } from 'generated/prisma/client';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mailQueue') private mailQueue: Queue) {}

  async sendResetPasswordEmail(email: string, token: Token) {
    await this.mailQueue.add('send-reset-password', {
      email,
      tokenId: token.id,
    });

    return { message: 'Reset password email sent' };
  }

  async sendVerificationEmail(email: string, token: Token) {
    await this.mailQueue.add('send-verification-email', {
      email,
      tokenId: token.id,
    });

    return { message: 'Verification email sent' };
  }
}
