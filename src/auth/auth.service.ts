/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interface/jwt-payload.interface';
import { GoogleProfile } from './interface/google-profile.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { first_name, last_name, email, password } = registerDto;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new HttpException(
        'Email sudah terdaftar',
        HttpStatus.UNAUTHORIZED, // Status 401 (Unauthorized)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refreshToken to database
    await this.prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      message: 'Registrasi berhasil',
    };
  }

  async loginWithEmail(email: string, password: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException(
        'Email Belum Terdaftar',
        HttpStatus.UNAUTHORIZED, // Status 401 (Unauthorized)
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Password salah',
        HttpStatus.UNAUTHORIZED, // Status 401 (Unauthorized)
      );
    }

    // Generate JWT token
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });
    return {
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  async loginWithGoogle(profile: GoogleProfile) {
    // Check if user exists, if not create a new one
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          role: 'SISWA', // Default role, you can modify this
        },
      });
    }

    // Generate JWT token
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.prisma.user.update({
      where: { email: user.email },
      data: { refreshToken },
    });

    return {
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  private generateRefreshToken(user: any) {
    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1d',
    }); // 7 hari
  }

  // Fungsi untuk membuat JWT token
  private generateAccessToken(user: any) {
    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
  }
  // Fungsi untuk refresh token
  async refreshToken(oldRefreshToken: string) {
    try {
      // Verify the refresh token
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.SECRET_KEY,
      ) as JwtPayload;

      // Check if the user exists and the refresh token matches
      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token and refresh token
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Update the refresh token in the database
      await this.prisma.user.update({
        where: { email: user.email },
        data: { refreshToken },
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
