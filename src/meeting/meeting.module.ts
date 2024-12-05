// src/meeting/meeting.module.ts
import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
