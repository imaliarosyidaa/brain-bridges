/* eslint-disable @typescript-eslint/no-unused-vars */
// src/class/class.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateClassDto } from './dto/update-class.dto';
import { LeaveKelasSiswaDto } from './dto/leave.dto';
import { JoinKelasSiswaDto } from './dto/join.dto';
import { AnggotaDto } from './dto/anggota.dto';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Class (Admin only)
  async createClass(createClassDto: CreateClassDto, userEmail: string) {
    const { name, description, pengajar_id, topic_id } = createClassDto;
    console.log('Creating class with data:', createClassDto);

    // Ensure topic exists
    const topic = await this.prisma.topic.findUnique({
      where: { id: topic_id },
    });

    if (!topic) {
      console.error(`Topic with id ${topic_id} not found`);
      throw new NotFoundException('Topic tidak ditemukan');
    }
    console.log('Topic found:', topic);

    // If the user is a Pengajar and no pengajar_id is provided, fetch the ID by email
    let resolvedPengajarId = pengajar_id;

    if (!pengajar_id && userEmail) {
      console.log(`Fetching user ID for email: ${userEmail}`);
      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        console.error('User not found by email');
        throw new NotFoundException('Pengajar tidak ditemukan');
      }

      resolvedPengajarId = user.id;
      console.log(`Resolved Pengajar ID: ${resolvedPengajarId}`);
    }

    // If no valid pengajar_id could be resolved, throw an error
    if (!resolvedPengajarId) {
      console.error('Pengajar ID could not be resolved');
      throw new NotFoundException('Pengajar tidak ditemukan');
    }

    // Create class
    try {
      console.log('Creating new class...');
      const newClass = await this.prisma.class.create({
        data: {
          name,
          description,
          pengajar_id: resolvedPengajarId,
          topic_id,
        },
      });

      console.log('Class created successfully:', newClass);
      return newClass;
    } catch (error) {
      console.error('Error creating class:', error);
      throw new Error('Failed to create class');
    }
  }

  // Get Class by ID (Siswa, Pengajar, Admin)
  async getClassById(id: number) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        pengajar: true,
        topic: true,
        siswa: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData;
  }

  // Get Class by ID (Pengajar)
  async getClassByPengajarId(id: number) {
    const classData = await this.prisma.class.findMany({
      where: { pengajar_id: id },
      include: {
        pengajar: true,
        topic: true,
        siswa: true,
      },
    });

    if (!classData) {
      throw new NotFoundException('Class not found');
    }

    return classData;
  }

  // Get All Classes with optional search (Siswa, Pengajar, Admin)
  async getAllClassesWithSearch(search: string = '') {
    // Filter untuk pencarian berdasarkan nama kelas
    const where: Prisma.ClassWhereInput = search
      ? {
          name: {
            contains: search,
            mode: Prisma.QueryMode.insensitive, // Menggunakan mode insensitive untuk pencarian case-insensitive
          },
        }
      : {};

    // Mengambil kelas berdasarkan pencarian dan juga relasi pengajar dan topik
    const classes = await this.prisma.class.findMany({
      where,
      include: {
        pengajar: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        topic: {
          select: {
            name: true,
          },
        },
      },
    });

    // Jika ada hasil pencarian, tambahkan nama pengajar dan topik ke setiap kelas
    const result = classes.map((kelas) => {
      return {
        ...kelas,
        pengajar_name: `${kelas.pengajar.first_name} ${kelas.pengajar.last_name}`, // Gabungkan nama depan dan belakang pengajar
        topic_name: kelas.topic.name, // Ambil nama topik
      };
    });

    return result;
  }

  // Update Class (Admin only)
  async updateClass(id: number, updateClassDto: UpdateClassDto) {
    try {
      // Melakukan update pada kelas
      const updatedClass = await this.prisma.class.update({
        where: { id },
        data: updateClassDto,
      });

      // Mengembalikan status dan message bersama data kelas yang telah diperbarui
      return {
        status: 'success',
        message: 'Class updated successfully',
        data: updatedClass,
      };
    } catch (error) {
      // Jika terjadi error (misalnya kelas tidak ditemukan)
      return {
        status: 'error',
        message: `Error updating class: ${error.message}`,
      };
    }
  }

  // Delete Class (Admin only)
  async deleteClass(id: number) {
    const classToDelete = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classToDelete) {
      throw new NotFoundException('Class not found');
    }

    await this.prisma.class.delete({
      where: { id },
    });

    return { status: 'success', message: 'Class deleted successfully' };
  }

  async joinClass(userEmail: string, kelasId: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Convert kelasId ke number
    const kelasIdNumber = Number(kelasId);

    // Cek apakah user sudah terdaftar dalam kelas yang sama
    const existingRecord = await this.prisma.kelasSiswa.findFirst({
      where: {
        user_id: user.id,
        kelas_id: kelasIdNumber,
      },
    });

    if (existingRecord) {
      throw new Error('User is already joined to this class');
    }

    // Join kelas
    return this.prisma.kelasSiswa.create({
      data: {
        kelas_id: kelasIdNumber,
        user_id: user.id,
      },
    });
  }

  // Leave class untuk siswa
  async leaveClass(userEmail: string, kelasId: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Convert kelasId ke number
    const kelasIdNumber = Number(kelasId);

    // Cek apakah user terdaftar di kelas ini
    const existingRecord = await this.prisma.kelasSiswa.findFirst({
      where: {
        user_id: user.id,
        kelas_id: kelasIdNumber,
      },
    });

    if (!existingRecord) {
      throw new Error('User is not enrolled in this class');
    }

    // Leave kelas
    return this.prisma.kelasSiswa.delete({
      where: {
        id: existingRecord.id,
      },
    });
  }

  async getSiswaByKelasId(kelasId: number): Promise<AnggotaDto[]> {
    // Cek apakah kelas dengan kelasId ada
    const kelasExist = await this.prisma.class.findUnique({
      where: { id: kelasId },
    });

    if (!kelasExist) {
      throw new NotFoundException(
        `Kelas dengan ID ${kelasId} tidak ditemukan.`,
      );
    }

    // Ambil siswa dari kelas_siswa berdasarkan kelasId
    const siswa = await this.prisma.kelasSiswa.findMany({
      where: { kelas_id: kelasId },
      include: {
        siswa: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    // Map data ke UserDto
    return siswa.map((entry) => ({
      name: entry.siswa.first_name + ' ' + entry.siswa.last_name,
      email: entry.siswa.email,
      foto: entry.siswa.photo,
    }));
  }

  // Delete user from class
  async deleteMemberByClass(userEmail: string, kelasId: number) {
    // Validasi email
    console.log(userEmail);
    if (!userEmail) {
      throw new Error('Email tidak valid');
    }

    // Cari user berdasarkan email
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Convert kelasId ke number
    const kelasIdNumber = Number(kelasId);

    // Cek apakah user terdaftar di kelas ini
    const existingRecord = await this.prisma.kelasSiswa.findFirst({
      where: {
        user_id: user.id,
        kelas_id: kelasIdNumber,
      },
    });

    if (!existingRecord) {
      throw new Error('User is not enrolled in this class');
    }

    // Hapus anggota dari kelas
    return this.prisma.kelasSiswa.delete({
      where: {
        id: existingRecord.id,
      },
    });
  }
}
