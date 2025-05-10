import {
  Controller,
  Post,
  Put,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Logger,
  BadRequestException,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingService } from './meeting.service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

@Controller('api/meeting')
export class MeetingController {
  private readonly logger = new Logger(MeetingController.name);

  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'vidio1', maxCount: 1 },
        { name: 'vidio2', maxCount: 1 },
        { name: 'vidio3', maxCount: 1 },
        { name: 'file_materi1', maxCount: 1 },
        { name: 'file_materi2', maxCount: 1 },
        { name: 'file_materi3', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            // Menentukan folder berdasarkan fieldname
            const folder = file.fieldname.includes('vidio')
              ? './uploads/materi/vidio'
              : './uploads/materi/file';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            // Menggunakan UUID dan nama file asli untuk mencegah duplikasi nama file
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Validasi file berdasarkan ekstensi dan MIME type
          const videoMimeTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'];
          const fileMimeTypes = ['application/pdf', 'application/docx'];

          if (
            (file.fieldname.includes('vidio') &&
              !videoMimeTypes.includes(file.mimetype)) ||
            (file.fieldname.includes('file_materi') &&
              !fileMimeTypes.includes(file.mimetype))
          ) {
            return cb(new Error('Invalid file type.'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createMeeting(
    @Body() createMeetingDto: CreateMeetingDto,
    @Req() req: any,
  ) {
    this.logger.log('Incoming request for creating a meeting');
    this.logger.log('Received CreateMeetingDto: ', createMeetingDto);
    const user = req.user;

    // Log kelasId and ensure it's an integer
    const kelasId = Number(createMeetingDto.kelasId);
    this.logger.log(`Parsed kelasId: ${kelasId}`);
    if (isNaN(kelasId)) {
      this.logger.error('Invalid kelasId: Should be an integer');
      throw new BadRequestException('KelasId harus berupa angka.');
    }

    // Log the final CreateMeetingDto before passing it to the service
    this.logger.log('Final CreateMeetingDto: ', createMeetingDto);

    // Call service untuk simpan meeting
    return this.meetingService.createMeeting(createMeetingDto, user);
  }

  // New GET method for fetching meetings by class ID
  @Get('/:kelasId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa)
  async getMeetingsByClassId(@Param('kelasId') kelasId: string) {
    this.logger.log('Incoming request to get meetings by class ID');
    const kelasIdInt = Number(kelasId);
    if (isNaN(kelasIdInt)) {
      this.logger.error('Invalid kelasId: Should be an integer');
      throw new BadRequestException('KelasId harus berupa angka.');
    }

    // Call service to fetch meetings
    return this.meetingService.getMeetingsByClassId(kelasIdInt);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'vidio1', maxCount: 1 },
        { name: 'file_materi1', maxCount: 1 },
        { name: 'vidio2', maxCount: 1 },
        { name: 'file_materi2', maxCount: 1 },
        { name: 'vidio3', maxCount: 1 },
        { name: 'file_materi3', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder = file.fieldname.includes('vidio')
              ? './uploads/materi/vidio'
              : './uploads/materi/file';
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const filename = `${uuidv4()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          const videoMimeTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov'];
          const fileMimeTypes = ['application/pdf', 'application/docx'];

          if (
            (file.fieldname.includes('vidio') &&
              !videoMimeTypes.includes(file.mimetype)) ||
            (file.fieldname.includes('file_materi') &&
              !fileMimeTypes.includes(file.mimetype))
          ) {
            return cb(new Error('Invalid file type.'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateMeeting(
    @Param('id') id: number,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @UploadedFiles() files: any,
  ) {
    this.logger.log(`Received update request for meeting ID: ${id}`);
    this.logger.log('Files received:', files);

    // Update meeting with files
    const meetingId = Number(id);
    return this.meetingService.updateMeeting(
      meetingId,
      updateMeetingDto,
      files,
    );
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteMeeting(@Param('id') id: number) {
    const meetingId = Number(id); // Pastikan id diproses sebagai number
    this.logger.log(`Deleting meeting by id: ${id}`);

    // Ambil data meeting yang akan dihapus untuk mendapatkan nama file
    const meeting = await this.meetingService.getMeetingById(meetingId);

    if (!meeting) {
      throw new Error('Meeting not found');
    }

    // Fungsi reusable untuk menghapus file
    const deleteFile = (
      filePath: string | null,
      baseDir: string,
      fileType: string,
    ) => {
      if (filePath) {
        try {
          const resolvedPath = path.join(baseDir, path.basename(filePath));
          fs.unlinkSync(resolvedPath); // Menghapus file
          this.logger.log(`Deleted ${fileType} file: ${resolvedPath}`);
        } catch (err) {
          this.logger.error(
            `Failed to delete ${fileType} file: ${err.message}`,
          );
        }
      }
    };

    // Hapus semua file terkait menggunakan fungsi deleteFile
    deleteFile(meeting.vidio1, './uploads/materi/vidio', 'vidio1');
    deleteFile(meeting.vidio2, './uploads/materi/vidio', 'vidio2');
    deleteFile(meeting.vidio3, './uploads/materi/vidio', 'vidio3');
    deleteFile(meeting.file_materi1, './uploads/materi/file', 'file_materi1');
    deleteFile(meeting.file_materi2, './uploads/materi/file', 'file_materi2');
    deleteFile(meeting.file_materi3, './uploads/materi/file', 'file_materi3');

    // Hapus meeting dari database setelah file dihapus
    await this.meetingService.deleteMeeting(meetingId);

    return { message: 'Meeting and associated files deleted successfully.' };
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async getMeetingById(@Param('id') id: number) {
    const meetingId = Number(id);
    const meeting = await this.meetingService.getMeetingById(meetingId);
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    return meeting;
  }
}
