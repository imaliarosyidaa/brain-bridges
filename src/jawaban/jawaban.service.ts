// src/jawaban/jawaban.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJawabanDto } from './dto/create-jawaban.dto';
import { UpdateJawabanDto } from './dto/update-jawaban.dto';
import { AssignNilaiDto } from './dto/assign-nilai.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JawabanService {
  private readonly logger = new Logger(JawabanService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get all Jawaban with optional pagination and search
  async getAllJawaban(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;
    const [total, jawaban] = await Promise.all([
      this.prisma.jawaban.count({
        where: {
          OR: [
            { jawaban: { contains: search, mode: 'insensitive' } },
            // Add more search conditions if necessary
          ],
        },
      }),
      this.prisma.jawaban.findMany({
        where: {
          OR: [
            { jawaban: { contains: search, mode: 'insensitive' } },
            // Add more search conditions if necessary
          ],
        },
        skip,
        take: limit,
        include: {
          assesments: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: jawaban,
    };
  }

  // Get Jawaban by ID
  async getJawabanById(id: number) {
    const jawaban = await this.prisma.jawaban.findUnique({
      where: { id },
      include: {
        assesments: true,
      },
    });
    if (!jawaban) {
      throw new NotFoundException(`Jawaban with ID ${id} not found`);
    }
    return jawaban;
  }

  async createJawaban(
    createJawabanDto: CreateJawabanDto,
    file?: Express.Multer.File,
    userId?: number) {
    try {
      const data: any = {
        assesment_id: Number(createJawabanDto.assesmentId),
        jawaban: createJawabanDto.jawaban || null, // Set null jika tidak ada jawaban
        siswa_id: Number(createJawabanDto.siswaId),
      };

      if (file) {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
          throw new Error('BASE_URL environment variable is not defined');
        }
        data.file = `${baseUrl}/uploads/file/jawaban/${file.filename}`;
      }
      console.log('Data being sent to Prisma:', data);
      return await this.prisma.jawaban.create({ data });
    } catch (error) {
      console.error('Error creating Jawaban:', error);
      throw new Error('Failed to create Jawaban');
    }
  }

  // Update Jawaban
  async updateJawaban(
    id: number,
    updateJawabanDto: UpdateJawabanDto,
    file?: Express.Multer.File,
  ) {
    const existingJawaban = await this.getJawabanById(id);

    if (file) {
      // Delete old file if exists
      if (existingJawaban.file) {
        try {
          const relativeFilePath = existingJawaban.file.replace(
            `${process.env.BASE_URL || 'http://localhost:3000'}/`,
            '',
          );
          fs.unlinkSync(relativeFilePath);
          this.logger.log(`Deleted old file: ${relativeFilePath}`);
        } catch (err) {
          this.logger.error(`Failed to delete old file: ${err.message}`);
        }
      }
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      updateJawabanDto.file = `${baseUrl}/uploads/file/jawaban/${file.filename}`;
    }

    return this.prisma.jawaban.update({
      where: { id },
      data: {
        ...updateJawabanDto,
        ...(file && { file: updateJawabanDto.file }),
      },
    });
  }

  // Delete Jawaban
  async deleteJawaban(id: number) {
    const jawaban = await this.getJawabanById(id);

    // Delete file if exists
    if (jawaban.file) {
      try {
        const filePath = path.join(
          './uploads/file/jawaban',
          path.basename(jawaban.file),
        );
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      } catch (err) {
        this.logger.error(`Failed to delete file: ${err.message}`);
      }
    }

    return this.prisma.jawaban.delete({
      where: { id },
    });
  }

  async getJawabanByAssesmentId(
    assesmentId: number,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;

    const [total, jawaban] = await Promise.all([
      this.prisma.jawaban.count({
        where: {
          assesment_id: assesmentId,
          jawaban: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.jawaban.findMany({
        where: {
          assesment_id: assesmentId,
          jawaban: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        include: {
          assesments: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: jawaban,
    };
  }

  async getJawabanBySiswaId(
    assesmentId: number,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * limit;

    const [total, jawaban] = await Promise.all([
      this.prisma.jawaban.count({
        where: {
          assesment_id: assesmentId,
          jawaban: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      this.prisma.jawaban.findMany({
        where: {
          assesment_id: assesmentId,
          jawaban: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
        include: {
          assesments: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: jawaban,
    };
  }

  async assignNilai(jawabanId: number, assignNilaiDto: AssignNilaiDto) {
    // Cek apakah jawaban dengan ID tersebut ada
    const existingJawaban = await this.prisma.jawaban.findUnique({
      where: { id: jawabanId },
    });

    if (!existingJawaban) {
      this.logger.warn(`Jawaban dengan ID ${jawabanId} tidak ditemukan.`);
      throw new NotFoundException(
        `Jawaban dengan ID ${jawabanId} tidak ditemukan.`,
      );
    }

    // Update nilai pada jawaban
    const updatedJawaban = await this.prisma.jawaban.update({
      where: { id: jawabanId },
      data: {
        nilai: assignNilaiDto.nilai,
      },
    });

    this.logger.log(
      `Nilai ${assignNilaiDto.nilai} diberikan kepada Jawaban ID ${jawabanId}.`,
    );

    return updatedJawaban;
  }
}
