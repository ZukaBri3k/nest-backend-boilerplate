import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [PrismaModule, BcryptModule],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
