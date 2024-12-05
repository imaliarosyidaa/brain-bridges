import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Get profile by email
  async getProfileByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Update profile by email
  async updateProfile(email: string, updateProfileDto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { email },
      data: {
        ...updateProfileDto, // Update the profile fields with the provided DTO
      },
    });
  }

  async changePassword(email: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = updatePasswordDto;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match.',
      );
    }

    // Get user from DB
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    // Check if old password is correct
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect old password.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password updated successfully.' };
  }
}
