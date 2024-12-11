// src/diskusi/diskusi.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiskusiDto } from './dto/create-diskusi.dto';
import { Diskusi } from '@prisma/client';

@Injectable()
export class DiskusiService {
  constructor(private readonly prisma: PrismaService) {}

  // Metode untuk mendapatkan user.id berdasarkan email
  async getUserIdByEmail(email: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user.id;
  }

  // Membuat komentar atau balasan
  async createDiskusi(
    createDiskusiDto: CreateDiskusiDto,
    userEmail: string,
  ): Promise<Diskusi> {
    const { kelas_id, message, parent_id } = createDiskusiDto;

    // Mendapatkan user.id dari email
    const userId = await this.getUserIdByEmail(userEmail);

    // Mengkonversi kelas_id dari string ke number
    const kelasIdNumber = Number(kelas_id);
    if (isNaN(kelasIdNumber)) {
      throw new NotFoundException('kelas_id harus berupa angka');
    }

    // Validasi kelas
    const kelas = await this.prisma.class.findUnique({
      where: { id: kelasIdNumber },
    });

    if (!kelas) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    // Jika parent_id disediakan, validasi komentar induk
    if (parent_id) {
      const parentDiskusi = await this.prisma.diskusi.findUnique({
        where: { id: parent_id },
      });

      if (!parentDiskusi) {
        throw new NotFoundException('Komentar induk tidak ditemukan');
      }

      // Optional: Cek apakah komentar induk berada dalam kelas yang sama
      if (parentDiskusi.kelas_id !== kelasIdNumber) {
        throw new ForbiddenException(
          'Komentar induk berada di kelas yang berbeda',
        );
      }
    }

    // Buat komentar atau balasan
    return this.prisma.diskusi.create({
      data: {
        kelas_id: kelasIdNumber,
        message,
        user_id: userId,
        parent_id: parent_id || null,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  }

  // Mengambil semua komentar beserta balasannya untuk sebuah kelas
  async getDiskusiByKelas(kelasId: number): Promise<any[]> {
    // Mengambil kelas_id sebagai number
    const kelasIdNumber = Number(kelasId);
    if (isNaN(kelasIdNumber)) {
      throw new NotFoundException('kelas_id harus berupa angka');
    }

    // Validasi kelas
    const kelas = await this.prisma.class.findUnique({
      where: { id: kelasIdNumber },
    });

    if (!kelas) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    // Ambil semua komentar induk (tanpa parent_id) dan balasannya
    const diskusi = await this.prisma.diskusi.findMany({
      where: {
        kelas_id: kelasIdNumber,
        parent_id: null, // Komentar induk
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            replies: true, // Jika ingin mendukung nested replies lebih dari satu level
          },
        },
      },
      orderBy: {
        comment_at: 'asc', // Dari lama ke terbaru
      },
    });

    return diskusi;
  }
}
