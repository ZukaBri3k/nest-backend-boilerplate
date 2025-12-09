import { Injectable } from '@nestjs/common';
import { Token } from 'generated/prisma/client';
import Mailjet from 'node-mailjet';

@Injectable()
export class MailjetService {
  constructor() {}

  async sendResetPasswordEmail(email: string, token: Token) {
    const mailjet = new Mailjet({
      apiKey: 'd128c6dea8e08957007e63c292a181e9',
      apiSecret: '26135bdb87dbbfb429726ea3f4c8247d',
    });

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'kyrilldumerchat@gmail.com',
            Name: 'App nest',
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: 'Reset Password',
          HTMLPart: `
            <p>Click the link below to reset your password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token.id}">Reset Password</a>
          `,
        },
      ],
    });

    return { message: 'Reset password email sent' };
  }
}
