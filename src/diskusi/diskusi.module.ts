import { Module } from '@nestjs/common';
import { DiskusiController } from './diskusi.controller';
import { DiskusiService } from './diskusi.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DiskusiController],
  providers: [DiskusiService, PrismaService],
})
export class DiskusiModule {}
