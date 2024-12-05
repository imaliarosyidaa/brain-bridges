// src/book/book.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Prisma } from '@prisma/client'; // Import Prisma, no need for BookWhereInput

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  // GET all books with pagination and search
  // GET all books with pagination and search
  async getAllBooks(page: number = 1, limit: number = 10, search: string = '') {
    // Jika search kosong atau null, kita tidak memberikan filter
    page = page < 1 ? 1 : page;
    const pages = Number(page);
    const limits = Number(limit);
    const where: Prisma.BookWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive', // Case-insensitive search
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive', // Case-insensitive search
              },
            },
          ],
        }
      : {};

    return this.prisma.book.findMany({
      where, // Apply search filter (jika ada)
      skip: (pages - 1) * limits, // Pagination: skip to the right page
      take: limits, // Limit the number of records returned
      orderBy: {
        id: 'desc', // Sort by id in descending order (atau field lainnya jika diperlukan)
      },
    });
  }

  // GET book by ID
  async getBookById(id: number) {
    return this.prisma.book.findUnique({
      where: { id },
    });
  }

  // CREATE a new book
  async createBook(createBookDto: CreateBookDto) {
    console.log('Received CreateBookDto:', createBookDto);

    // Ensure cover and file are provided correctly
    if (!createBookDto.cover || !createBookDto.file) {
      throw new Error('Cover and file are required fields.');
    }

    return this.prisma.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        cover: createBookDto.cover, // Ensure it's a valid path or URL
        file: createBookDto.file, // Ensure it's a valid path or URL for the file
      },
    });
  }

  // UPDATE an existing book
  async updateBook(id: number, updateBookDto: CreateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: {
        title: updateBookDto.title,
        description: updateBookDto.description,
        cover: updateBookDto.cover, // update cover path
        file: updateBookDto.file, // update PDF file path
      },
    });
  }

  // DELETE a book
  async deleteBook(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
