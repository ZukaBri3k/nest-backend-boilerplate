import { Module } from '@nestjs/common';
import { MailjetService } from './mailjet.service';

@Module({
  providers: [MailjetService],
  imports: [],
  exports: [MailjetService],
})
export class MailjetModule {}
