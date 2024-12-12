/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssesmentDto } from './dto/create-assesment.dto';
import { parseISO } from 'date-fns';
import path from 'path';
import fs from 'fs';
import { UpdateAssesmentDto } from './dto/update-assesment.dto';

@Injectable()
export class AssesmentService {
  constructor(private readonly prisma: PrismaService) {}

  // Mengecek apakah user adalah pengajar kelas tertentu
  async isTeacherOfClass(kelasId: string, userEmail: string): Promise<boolean> {
    const kelas_id = Number(kelasId);
    const kelas = await this.prisma.class.findUnique({
      where: { id: kelas_id },
      include: { pengajar: true },
    });

    if (!kelas) {
      throw new NotFoundException('Class not found.');
    }

    // Verifikasi apakah pengajar kelas sesuai dengan email yang diterima
    return kelas.pengajar.email === userEmail;
  }

  // Membuat assesment baru
  async createAssesment(createAssesmentDto: CreateAssesmentDto) {
    const { kelasId, title, description, deadlines, file1, file2, file3 } =
      createAssesmentDto;

    const deadline = parseISO(deadlines);
    const kelas_id = Number(kelasId);
    return this.prisma.assesment.create({
      data: {
        kelas_id,
        title,
        description,
        deadline,
        file1,
        file2,
        file3,
      },
    });
  }

  async getAssesmentById(id: string) {
    const assesment = await this.prisma.assesment.findUnique({
      where: { id: Number(id) },
    });

    if (!assesment) {
      throw new NotFoundException('Assessment not found.');
    }

    return assesment;
  }

  async getAssesmentByClassId(id: string) {
    const kelasId = Number(id);

    if (isNaN(kelasId)) {
      throw new BadRequestException('Invalid class ID format.');
    }

    const assessments = await this.prisma.assesment.findMany({
      where: { kelas_id: kelasId },
      include: {
        kelas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!assessments || assessments.length === 0) {
      throw new NotFoundException(
        'No assessments found for the given class ID.',
      );
    }

    return assessments;
  }

  async updateAssesment(
    id: string,
    updateAssesmentDto: UpdateAssesmentDto,
    file1: string,
    file2: string,
    file3: string,
  ) {
    const assesment = await this.getAssesmentById(id);

    // Membuat objek pembaruan dengan data yang diterima
    const updateData: any = {};

    if (updateAssesmentDto.kelasId) {
      updateData.kelas_id = Number(updateAssesmentDto.kelasId);
    }

    if (updateAssesmentDto.title) {
      updateData.title = updateAssesmentDto.title;
    }

    if (updateAssesmentDto.description) {
      updateData.description = updateAssesmentDto.description;
    }

    if (updateAssesmentDto.deadlines) {
      updateData.deadline = parseISO(updateAssesmentDto.deadlines);
    }

    // Jika file baru di-upload, perbarui path file
    if (file1) {
      updateData.file1 = file1;
    }

    if (file2) {
      updateData.file2 = file2;
    }

    if (file3) {
      updateData.file3 = file3;
    }

    return this.prisma.assesment.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }
}
