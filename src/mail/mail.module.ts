import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailConsumer } from './mail.consumer';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, MailConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
