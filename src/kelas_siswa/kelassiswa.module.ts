import { Module } from '@nestjs/common';
import { KelasSiswaService } from './kelassiswa.service';
import { KelasSiswaController } from './kelassiswa.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [KelasSiswaService, PrismaService],
  controllers: [KelasSiswaController],
})
export class KelasSiswaModule {}
