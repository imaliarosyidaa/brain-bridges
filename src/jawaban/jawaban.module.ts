// src/jawaban/jawaban.module.ts
import { Module } from '@nestjs/common';
import { JawabanService } from './jawaban.service';
import { JawabanController } from './jawaban.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [JawabanController],
  providers: [JawabanService, PrismaService],
})
export class JawabanModule {}
