import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailjetConsumer } from './mailjet.consumer';
import { MailjetService } from './mailjet.service';

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
