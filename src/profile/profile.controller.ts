import {
  Controller,
  Get,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Logger,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('api/profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  // GET profile
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const email = req.user.email; // Retrieve the email from JWT token
    return this.profileService.getProfileByEmail(email);
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
          return cb(
            new Error(
              'Only PNG and JPEG images are allowed for profile photo.',
            ),
            false,
          );
        }
        cb(null, true); // accept the file
      },
    }),
  )
  async updateProfile(
    @Req() req,
    @UploadedFile() photo: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const email = req.user.email; // Get user email from JWT

    // Get the BASE_URL from environment variables
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Default to localhost if not set

    // Process photo if it is updated
    if (photo) {
      // Get existing user data
      const user = await this.profileService.getProfileByEmail(email);

      // Delete the old photo from storage if it exists
      if (user && user.photo) {
        const photoPath = path.join(
          './uploads/profile',
          path.basename(user.photo),
        );
        try {
          fs.unlinkSync(photoPath); // Delete old photo
          this.logger.log(`Deleted old photo: ${photoPath}`);
        } catch (error) {
          this.logger.error(`Error deleting old photo: ${error.message}`);
        }
      }

      // Update the photo field in the DTO with full URL (BASE_URL + file path)
      updateProfileDto.photo = `${baseUrl}/uploads/profile/${photo.filename}`;
    }

    // Update the user profile in the database
    return this.profileService.updateProfile(email, updateProfileDto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const email = req.user.email; // Get the user email from JWT token
    return this.profileService.changePassword(email, updatePasswordDto);
  }
}
