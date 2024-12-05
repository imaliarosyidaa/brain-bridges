// src/user/user.module.ts
import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [],
  providers: [
    UserService,
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // Global validation pipe for DTO validation
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
