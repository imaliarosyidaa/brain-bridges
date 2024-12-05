import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/books')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(private readonly bookService: BookService) {}

  // GET All Books
  // Endpoint untuk mengambil semua buku dengan pagination dan pencarian
  @Get()
  async getAllBooks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    return this.bookService.getAllBooks(page, limit, search);
  }

  // GET Book by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa, Role.Admin, Role.Pengajar)
  async getBookById(@Param('id') id: number) {
    const bookId = Number(id);
    this.logger.log(`Getting book by id: ${bookId}`);
    return await this.bookService.getBookById(bookId);
  }

  // POST Create Book by ADMIN
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover', maxCount: 1 }, // Field 'cover' untuk gambar
        { name: 'file', maxCount: 1 }, // Field 'file' untuk PDF
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder =
              file.fieldname === 'cover'
                ? './uploads/file/cover'
                : './uploads/file/library';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'cover') {
            if (
              file.mimetype !== 'image/png' &&
              file.mimetype !== 'image/jpeg'
            ) {
              return cb(
                new Error('Only PNG and JPEG images are allowed for cover.'),
                false,
              );
            }
          } else if (file.fieldname === 'file') {
            if (file.mimetype !== 'application/pdf') {
              return cb(new Error('Only PDF files are allowed.'), false);
            }
          }
          cb(null, true); // accept the file
        },
      },
    ),
  )
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Default if BASE_URL is not set

    // Process cover and file fields
    if (files.cover && files.cover.length > 0) {
      const coverFile = files.cover[0];
      // Save the full URL of the cover image in the database
      createBookDto.cover = `${baseUrl}/uploads/file/cover/${coverFile.filename}`;
    }
    if (files.file && files.file.length > 0) {
      const fileFile = files.file[0];
      // Save the full URL of the PDF file in the database
      createBookDto.file = `${baseUrl}/uploads/file/library/${fileFile.filename}`;
    }

    // Save the book with complete URL paths
    const createdBook = await this.bookService.createBook(createBookDto);

    return createdBook;
  }

  // Admin - PUT Update Book
  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover', maxCount: 1 }, // Field 'cover' untuk gambar
        { name: 'file', maxCount: 1 }, // Field 'file' untuk PDF
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder =
              file.fieldname === 'cover'
                ? './uploads/file/cover'
                : './uploads/file/library';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'cover') {
            if (
              file.mimetype !== 'image/png' &&
              file.mimetype !== 'image/jpeg'
            ) {
              return cb(
                new Error('Only PNG and JPEG images are allowed for cover.'),
                false,
              );
            }
          } else if (file.fieldname === 'file') {
            if (file.mimetype !== 'application/pdf') {
              return cb(new Error('Only PDF files are allowed.'), false);
            }
          }
          cb(null, true); // accept the file
        },
      },
    ),
  )
  async updateBook(
    @Param('id') id: number,
    @Body() updateBookDto: CreateBookDto,
    @UploadedFiles()
    files: { cover?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    this.logger.log(`Updating book by id: ${id}`);

    const bookId = Number(id);

    // Dapatkan data buku yang sedang diupdate dari database
    const existingBook = await this.bookService.getBookById(bookId);

    if (existingBook) {
      // Hapus file cover lama jika ada file cover baru
      if (files.cover && files.cover.length > 0) {
        if (existingBook.cover) {
          try {
            // Ambil path relatif dari URL lengkap
            const relativeCoverPath = existingBook.cover.replace(
              `${baseUrl}/`,
              '',
            );
            fs.unlinkSync(relativeCoverPath); // Hapus cover lama
          } catch (err) {
            this.logger.error(
              `Failed to delete old cover file: ${err.message}`,
            );
          }
        }
        updateBookDto.cover = `${baseUrl}/uploads/file/cover/${files.cover[0].filename}`;
      }

      // Hapus file lama jika ada file PDF baru
      if (files.file && files.file.length > 0) {
        if (existingBook.file) {
          try {
            // Ambil path relatif dari URL lengkap
            const relativeFilePath = existingBook.file.replace(
              `${baseUrl}/`,
              '',
            );
            fs.unlinkSync(relativeFilePath); // Hapus file lama
          } catch (err) {
            this.logger.error(`Failed to delete old file: ${err.message}`);
          }
        }
        updateBookDto.file = `${baseUrl}/uploads/file/library/${files.file[0].filename}`;
      }
    }

    // Update data buku
    const updatedBook = await this.bookService.updateBook(
      bookId,
      updateBookDto,
    );

    // Tidak perlu mengubah path karena sudah lengkap
    return updatedBook;
  }

  // Admin - DELETE Book
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteBook(@Param('id') id: number) {
    const bookId = Number(id); // Pastikan id diproses sebagai number
    this.logger.log(`Deleting book by id: ${id}`);

    // Ambil data buku yang akan dihapus untuk mendapatkan nama file dan cover
    const book = await this.bookService.getBookById(bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    // Hapus file cover jika ada (gunakan nama file yang disimpan di database)
    if (book.cover) {
      try {
        const coverFilePath = path.join(
          './uploads/file/cover',
          path.basename(book.cover),
        ); // Ambil hanya nama file
        fs.unlinkSync(coverFilePath); // Menghapus file cover dari server
        this.logger.log(`Deleted cover file: ${coverFilePath}`);
      } catch (err) {
        this.logger.error(`Failed to delete cover file: ${err.message}`);
      }
    }

    // Hapus file PDF jika ada (gunakan nama file yang disimpan di database)
    if (book.file) {
      try {
        const fileFilePath = path.join(
          './uploads/file/library',
          path.basename(book.file),
        ); // Ambil hanya nama file
        fs.unlinkSync(fileFilePath); // Menghapus file PDF dari server
        this.logger.log(`Deleted file: ${fileFilePath}`);
      } catch (err) {
        this.logger.error(`Failed to delete file: ${err.message}`);
      }
    }

    // Hapus buku dari database setelah file dihapus
    await this.bookService.deleteBook(bookId);

    return { message: 'Book and associated files deleted successfully.' };
  }
}
