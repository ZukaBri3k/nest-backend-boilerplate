import { Module, forwardRef } from '@nestjs/common';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailjetModule } from 'src/mailjet/mailjet.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    JwtModule,
    UserModule,
    BcryptModule,
    PrismaModule,
    forwardRef(() => MailjetModule),
  ],
})
export class AuthModule {}
