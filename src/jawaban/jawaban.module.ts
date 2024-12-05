import { Module } from '@nestjs/common';
import { JawabanService } from './jawaban.service';
import { JawabanController } from './jawaban.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [JawabanService, PrismaService],
  controllers: [JawabanController],
})
export class JawabanModule {}
