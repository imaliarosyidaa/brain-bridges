// src/topic/topic.module.ts
import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TopicService, PrismaService],
  controllers: [TopicController],
})
export class TopicModule {}
