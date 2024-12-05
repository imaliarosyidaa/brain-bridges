import { Injectable } from '@nestjs/common';
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

    // Check if the email already exists
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error('email telah terdaftar');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await this.prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });

    return {
      status: 'Created',
      message: 'Registrasi berhasil',
    };
  }

  async loginWithEmail(email: string, password: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
    };

    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    return {
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      role: user.role,
      jwt: jwtToken,
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
    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
    };

    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    return {
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      role: user.role,
      jwt: jwtToken,
    };
  }
}
