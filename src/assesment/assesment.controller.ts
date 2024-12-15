import {
  Controller,
  Post,
  UseGuards,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ForbiddenException,
  Req,
  Param,
  Put,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AssesmentService } from './assesment.service';
import { CreateAssesmentDto } from './dto/create-assesment.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { UpdateAssesmentDto } from './dto/update-assesment.dto';

@Controller('api/assesment')
export class AssesmentController {
  constructor(private readonly assesmentService: AssesmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/assesment',
          filename: (req, file, cb) => {
            const randomName = Array(16)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedExtensions = ['.pdf', '.docx', '.xlsx'];
          const ext = extname(file.originalname).toLowerCase();
          if (!allowedExtensions.includes(ext)) {
            return cb(new BadRequestException('Invalid file type'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async createAssesment(
    @Body() createAssesmentDto: CreateAssesmentDto,
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
    @Req() req: any,
  ) {
    const user = req.user;
    console.log('Authenticated user:', user);

    // Debug: Log tanggal yang diterima
    console.log('Received deadline:', createAssesmentDto.deadlines);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    // Assign uploaded file paths to DTO
    if (files?.file1?.length) {
      createAssesmentDto.file1 = `${baseUrl}/uploads/assesment/${files.file1[0].filename}`; // Menyimpan path file ke dalam DTO
    }
    if (files?.file2?.length) {
      createAssesmentDto.file2 = `${baseUrl}/uploads/assesment/${files.file2[0].filename}`; // Menyimpan path file ke dalam DTO
    }
    if (files?.file3?.length) {
      createAssesmentDto.file3 = `${baseUrl}/uploads/assesment/${files.file3[0].filename}`; // Menyimpan path file ke dalam DTO
    }

    // Jika Admin, bisa langsung create
    if (user.role === 'ADMIN') {
      return this.assesmentService.createAssesment(createAssesmentDto);
    }

    const isAuthorized = await this.assesmentService.isTeacherOfClass(
      createAssesmentDto.kelasId,
      user.email, // Assuming `user.email` contains the email
    );
    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to create assessments for this class.',
      );
    }

    // Jika pengajar berhak, lanjutkan pembuatan assessment
    return this.assesmentService.createAssesment(createAssesmentDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa)
  async getAssesmentById(@Param('id') id: string) {
    try {
      const assesment = await this.assesmentService.getAssesmentById(id);
      return assesment;
    } catch (error) {
      // Error handling untuk not found
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Assessment not found.');
      }
      throw error; // Rethrow error jika bukan NotFoundException
    }
  }

  @Get('class/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa)
  async getAssesmentByClassId(@Param('id') id: string) {
    try {
      const assesment = await this.assesmentService.getAssesmentByClassId(id);
      return assesment;
    } catch (error) {
      // Error handling untuk not found
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Assessment not found.');
      }
      throw error; // Rethrow error jika bukan NotFoundException
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 1 },
        { name: 'file3', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/assesment',
          filename: (req, file, cb) => {
            const randomName = Array(16)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedExtensions = ['.pdf', '.docx', '.xlsx'];
          const ext = extname(file.originalname).toLowerCase();
          if (!allowedExtensions.includes(ext)) {
            return cb(new BadRequestException('Invalid file type'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateAssesment(
    @Param('id') id: string,
    @Body() updateAssesmentDto: UpdateAssesmentDto, // Menggunakan DTO baru
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
      file3?: Express.Multer.File[];
    },
    @Req() req: any,
  ) {
    const user = req.user;

    // Verifikasi apakah user berhak melakukan update
    const isAuthorized = await this.assesmentService.isTeacherOfClass(
      updateAssesmentDto.kelasId,
      user.email,
    );

    if (!isAuthorized && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You are not authorized to update this assessment.',
      );
    }

    // Fetch existing assessment untuk menjaga nilai lama
    const existingAssesment = await this.assesmentService.getAssesmentById(id);
    let file1 = existingAssesment.file1;
    let file2 = existingAssesment.file2;
    let file3 = existingAssesment.file3;

    // Jika file baru dikirimkan, ganti file lama dengan file baru
    const baseUrl = process.env.BASE_URL;
    if (files?.file1?.length) {
      file1 = `${baseUrl}/uploads/assesment/${files.file1[0].filename}`;
    }
    if (files?.file2?.length) {
      file2 = `${baseUrl}/uploads/assesment/${files.file2[0].filename}`;
    }
    if (files?.file3?.length) {
      file3 = `${baseUrl}/uploads/assesment/${files.file3[0].filename}`;
    }

    // Update data assesment dengan data yang baru atau lama
    return this.assesmentService.updateAssesment(
      id,
      updateAssesmentDto,
      file1,
      file2,
      file3,
    );
  }
}
