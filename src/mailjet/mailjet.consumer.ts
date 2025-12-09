import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import Mailjet from 'node-mailjet';

@Processor('mailjetQueue', {
  concurrency: 10,
})
export class MailjetConsumer extends WorkerHost {
  async process(
    job: Job<{ email: string; tokenId: string }, any, string>,
  ): Promise<any> {
    switch (job.name) {
      case 'send-reset-password':
        await this.sendResetPasswordEmail(job.data.email, job.data.tokenId);
        break;
      case 'send-verification-email':
        await this.sendVerificationEmail(job.data.email, job.data.tokenId);
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }

    await job.updateProgress(100);
  }

  async sendResetPasswordEmail(email: string, tokenId: string) {
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
            <a href="${process.env.FRONTEND_URL}/reset-password/${tokenId}">Reset Password</a>
          `,
        },
      ],
    });
  }

  async sendVerificationEmail(email: string, tokenId: string) {
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
          Subject: 'Verification Email',
          HTMLPart: `
            <p>Click the link below to verify your email:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${tokenId}">Verify Email</a>
          `,
        },
      ],
    });
  }
}
