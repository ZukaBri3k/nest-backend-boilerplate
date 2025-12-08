import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { BcryptModule } from './bcrypt/bcrypt.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), AuthModule, UserModule, JwtModule, BcryptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
