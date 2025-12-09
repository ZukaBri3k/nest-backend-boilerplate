import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import Mailjet from 'node-mailjet';
import { NotFoundError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailjetService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async sendResetPasswordEmail(email: string) {
    let user: User;

    try {
      user = await this.userService.findOneByEmail(email);
    } catch {
      throw new NotFoundError('User with this email does not exist');
    }

    const resetPasswordToken =
      await this.authService.generateResetPasswordToken(user.id);

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
            <a href="${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken.id}">Reset Password</a>
          `,
        },
      ],
    });

    return { message: 'Reset password email sent' };
  }
}
