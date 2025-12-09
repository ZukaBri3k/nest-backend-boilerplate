import { Module } from '@nestjs/common';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [PrismaModule, BcryptModule],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
