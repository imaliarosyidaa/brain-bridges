import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  imports: [], // Jika ada module lain yang perlu diimpor
  controllers: [BookController],
  providers: [BookService, PrismaService], // Pastikan PrismaService ada di sini
})
export class BookModule {}
