import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Token } from 'generated/prisma/client';

@Injectable()
export class MailjetService {
  constructor(@InjectQueue('mailjetQueue') private mailjetQueue: Queue) {}

  async sendResetPasswordEmail(email: string, token: Token) {
    await this.mailjetQueue.add('send-reset-password', {
      email,
      tokenId: token.id,
    });

    return { message: 'Reset password email sent' };
  }
}
