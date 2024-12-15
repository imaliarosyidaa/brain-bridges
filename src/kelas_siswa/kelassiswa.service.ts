import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KelasSiswaService {
  constructor(private readonly prisma: PrismaService) {}

  // Mendapatkan kelas siswa berdasarkan ID
  async getKelasSiswaById(id: string) {
    const kelasSiswa = await this.prisma.kelasSiswa.findUnique({
      where: { id: Number(id) },
      include: {
        kelas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!kelasSiswa) {
      throw new NotFoundException('Kelas Siswa not found.');
    }

    return kelasSiswa;
  }

  // Mendapatkan kelas siswa berdasarkan userId
  async getKelasSiswaByUserId(userId: string) {
    const user_id = Number(userId);

    const kelasSiswa = await this.prisma.kelasSiswa.findMany({
      where: { user_id },
      include: {
        kelas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!kelasSiswa || kelasSiswa.length === 0) {
      throw new NotFoundException('No classes found for the given user ID.');
    }

    return kelasSiswa;
  }

  // Mendapatkan kelas siswa berdasarkan kelasId
  async getKelasSiswaByKelasId(kelasId: string) {
    const kelas_id = Number(kelasId);

    const kelasSiswa = await this.prisma.kelasSiswa.findMany({
      where: { kelas_id },
    });

    if (!kelasSiswa || kelasSiswa.length === 0) {
      throw new NotFoundException('No students found for the given class ID.');
    }

    return kelasSiswa;
  }

  // Mendapatkan semua kelas siswa
  async getAllKelasSiswa() {
    const kelasSiswa = await this.prisma.kelasSiswa.findMany({
      include: {
        kelas: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!kelasSiswa || kelasSiswa.length === 0) {
      throw new NotFoundException('No Kelas Siswa found.');
    }

    return kelasSiswa;
  }
}
