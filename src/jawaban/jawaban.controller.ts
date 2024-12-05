import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Param,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateJawabanDto } from './dto/create-jawaban.dto';
import { JawabanService } from './jawaban.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateJawabanDto } from './dto/update-jawaban.dto';

@Controller('jawaban')
export class JawabanController {
  constructor(private readonly jawabanService: JawabanService) {}

  // CREATE Jawaban
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/jawaban',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async createJawaban(
    @Req() req,
    @Body() createJawabanDto: CreateJawabanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { assesmentId, jawaban, nilai } = createJawabanDto;

    // Convert assesmentId from string to number
    const assesmentIdNumber = Number(assesmentId);
    if (isNaN(assesmentIdNumber)) {
      throw new Error('Invalid assesmentId');
    }

    // Cek apakah saat ini sebelum atau sama dengan deadline
    const assesment =
      await this.jawabanService.getAssesmentById(assesmentIdNumber);
    const now = new Date();
    if (assesment.deadline < now) {
      throw new Error('The deadline has passed. You cannot upload the file.');
    }

    // Cegah siswa mengisi nilai, nilai harus tetap kosong
    const userRole = req.user.role;
    if (userRole === 'student' && nilai) {
      throw new Error('Students cannot assign a value to the answer.');
    }

    // Set nilai ke null jika siswa mencoba mengisi nilai
    createJawabanDto.nilai = null;

    // Jika ada file, update path file
    if (file) {
      createJawabanDto.file = `${process.env.BASE_URL}/uploads/jawaban/${file.filename}`;
    }

    return this.jawabanService.createJawaban(
      assesmentIdNumber,
      jawaban,
      createJawabanDto.nilai,
      createJawabanDto.file,
    );
  }

  // UPDATE Jawaban
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/jawaban',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async updateJawaban(
    @Req() req,
    @Param('id') id: number,
    @Body() updateJawabanDto: UpdateJawabanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { assesmentId, jawaban, nilai } = updateJawabanDto;

    // Convert assesmentId from string to number if it exists
    let assesmentIdNumber: number | undefined;
    if (assesmentId) {
      assesmentIdNumber = Number(assesmentId);
    }

    if (assesmentIdNumber && isNaN(assesmentIdNumber)) {
      throw new Error('Invalid assesmentId');
    }

    // Cek apakah saat ini sebelum atau sama dengan deadline
    const assesment =
      await this.jawabanService.getAssesmentById(assesmentIdNumber);
    const now = new Date();
    if (assesment.deadline < now) {
      throw new Error('The deadline has passed. You cannot update the file.');
    }

    // Cegah siswa mengubah nilai, nilai hanya bisa diubah oleh pengajar atau admin
    const userRole = req.user.role;
    if (userRole === 'student' && nilai) {
      throw new Error('Students cannot assign a value to the answer.');
    }

    // Set nilai ke null jika siswa mencoba mengubah nilai
    updateJawabanDto.nilai = null;

    // Jika file baru diupload, hapus file lama dan simpan file baru
    if (file) {
      // Get existing jawaban data to find the old file
      const jawaban = await this.jawabanService.getJawabanById(id);

      if (jawaban && jawaban.file) {
        const oldFilePath = path.join(
          './uploads/jawaban',
          path.basename(jawaban.file),
        );
        try {
          fs.unlinkSync(oldFilePath); // Delete old file
          console.log(`Deleted old file: ${oldFilePath}`);
        } catch (error) {
          console.error(`Error deleting old file: ${error.message}`);
        }
      }
      updateJawabanDto.file = `${process.env.BASE_URL}/uploads/jawaban/${file.filename}`;
    }

    return this.jawabanService.updateJawaban(
      id,
      assesmentIdNumber,
      jawaban,
      updateJawabanDto.nilai,
      updateJawabanDto.file,
    );
  }
}
