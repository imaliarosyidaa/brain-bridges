// src/user/user.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    // Check if the role is valid
    if (!Object.values(Role).includes(dto.role)) {
      throw new UnauthorizedException('Invalid role');
    }

    const existUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existUser) {
      throw new HttpException(
        'Email sudah terdaftar',
        HttpStatus.UNAUTHORIZED, // Status 401 (Unauthorized)
      );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create the user
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone_number: dto.phone_number,
        description: dto.description,
        photo: dto.photo,
        role: dto.role,
      },
    });
  }

  // Get users by role and optional search
  async getUsersByRole(role: Role, search: string = '') {
    // Build the base filter with role
    const where: Prisma.UserWhereInput = {
      role, // Filter by role
      ...(search && {
        OR: [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Fetch the data from Prisma
    return this.prisma.user.findMany({
      where, // Apply the combined filters (role and search if provided)
    });
  }

  // Delete user by ID and handle role-specific behavior
  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'PENGAJAR') {
      await this.prisma.class.updateMany({
        where: {
          pengajar_id: userId,
        },
        data: {
          pengajar_id: null, // Set pengajar_id to null
        },
      });
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
