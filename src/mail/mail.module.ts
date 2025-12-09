import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailjetConsumer } from './mail.consumer';
import { MailjetService } from './mail.service';

@Module({
  providers: [MailjetService, MailjetConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'mailjetQueue',
    }),
  ],
  exports: [MailjetService],
})
export class MailjetModule {}
