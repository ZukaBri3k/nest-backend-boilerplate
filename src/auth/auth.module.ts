import { Module, forwardRef } from '@nestjs/common';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { MailjetModule } from 'src/mailjet/mailjet.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClearTokenCron } from './clear-token.cron';

@Module({
  providers: [AuthService, ClearTokenCron],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UserModule,
    BcryptModule,
    PrismaModule,
    forwardRef(() => MailjetModule),
  ],
})
export class AuthModule {}
