import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [JwtModule, UserModule, BcryptModule],
})
export class AuthModule {}
