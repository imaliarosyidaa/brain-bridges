import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JawabanService {
  constructor(private prisma: PrismaService) {}

  // Mendapatkan assesment berdasarkan id
  async getAssesmentById(assesmentId: number) {
    return this.prisma.assesment.findUnique({
      where: { id: assesmentId },
    });
  }

  // Mendapatkan jawaban berdasarkan id
  async getJawabanById(id: number) {
    return this.prisma.jawaban.findUnique({
      where: { id },
    });
  }

  // Create jawaban
  async createJawaban(
    assesmentId: number,
    jawaban: string,
    nilai: number,
    file: string,
  ) {
    return this.prisma.jawaban.create({
      data: {
        assesment_id: assesmentId,
        jawaban,
        nilai,
        file,
      },
    });
  }

  // Update jawaban
  async updateJawaban(
    id: number,
    assesmentId: number,
    jawaban: string,
    nilai: number,
    file: string,
  ) {
    return this.prisma.jawaban.update({
      where: { id },
      data: {
        assesment_id: assesmentId,
        jawaban,
        nilai,
        file,
      },
    });
  }
}
