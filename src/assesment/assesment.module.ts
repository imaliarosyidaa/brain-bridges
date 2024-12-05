import { Module } from '@nestjs/common';
import { AssesmentService } from './assesment.service';
import { AssesmentController } from './assesment.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AssesmentService, PrismaService],
  controllers: [AssesmentController],
})
export class AssesmentModule {}
