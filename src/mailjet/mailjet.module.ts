import { Module, forwardRef } from '@nestjs/common';
import { MailjetService } from './mailjet.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MailjetService],
  imports: [UserModule, forwardRef(() => AuthModule)],
  exports: [MailjetService],
})
export class MailjetModule {}
