// src/jawaban/jawaban.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Req,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { JawabanService } from './jawaban.service';
import { CreateJawabanDto } from './dto/create-jawaban.dto';
import { UpdateJawabanDto } from './dto/update-jawaban.dto';
import { AssignNilaiDto } from './dto/assign-nilai.dto';

@Controller('api/jawaban')
export class JawabanController {
  private readonly logger = new Logger(JawabanController.name);

  constructor(private readonly jawabanService: JawabanService) {}

  // GET All Jawaban
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa)
  async getAllJawaban(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be numbers');
    }

    return this.jawabanService.getAllJawaban(pageNumber, limitNumber, search);
  }

  // GET Jawaban by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa, Role.Pengajar, Role.Admin)
  async getJawabanById(@Param('id') id: string) {
    const jawabanId = parseInt(id, 10);
    if (isNaN(jawabanId)) {
      throw new BadRequestException('ID must be a number');
    }
    this.logger.log(`Getting Jawaban by id: ${jawabanId}`);
    return await this.jawabanService.getJawabanById(jawabanId);
  }

  // GET Jawaban by ID
  @Get('siswa/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa, Role.Pengajar, Role.Admin)
  async getJawabanBySiswaId(@Param('id') id: string) {
    const siswaId = parseInt(id, 10);
    if (isNaN(siswaId)) {
      throw new BadRequestException('ID must be a number');
    }
    this.logger.log(`Getting Jawaban by Siswa id: ${siswaId}`);
    return await this.jawabanService.getJawabanBySiswaId(siswaId);
  }

  // POST Create Jawaban
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/file/jawaban',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'file') {
          if (
            file.mimetype !== 'application/pdf' &&
            file.mimetype !== 'image/png' &&
            file.mimetype !== 'image/jpeg'
          ) {
            return cb(
              new Error(
                'Only PDF, PNG, and JPEG files are allowed for Jawaban.',
              ),
              false,
            );
          }
        }
        cb(null, true); // accept the file
      },
    }),
  )
  async createJawaban(
    @Body() createJawabanDto: CreateJawabanDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.id; // Assuming JWT payload contains user id
    this.logger.log(`Creating Jawaban for user id: ${userId}`);
    return await this.jawabanService.createJawaban(
      createJawabanDto,
      file,
      userId,
    );
  }

  // PUT Update Jawaban
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/file/jawaban',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.fieldname === 'file') {
          if (
            file.mimetype !== 'application/pdf' &&
            file.mimetype !== 'image/png' &&
            file.mimetype !== 'image/jpeg'
          ) {
            return cb(
              new Error(
                'Only PDF, PNG, and JPEG files are allowed for Jawaban.',
              ),
              false,
            );
          }
        }
        cb(null, true); // accept the file
      },
    }),
  )
  async updateJawaban(
    @Param('id') id: string,
    @Body() updateJawabanDto: UpdateJawabanDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const jawabanId = parseInt(id, 10);
    if (isNaN(jawabanId)) {
      throw new BadRequestException('ID must be a number');
    }
    this.logger.log(`Updating Jawaban by id: ${jawabanId}`);
    return await this.jawabanService.updateJawaban(
      jawabanId,
      updateJawabanDto,
      file,
    );
  }

  // DELETE Jawaban
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa)
  async deleteJawaban(@Param('id') id: string) {
    const jawabanId = parseInt(id, 10);
    if (isNaN(jawabanId)) {
      throw new BadRequestException('ID must be a number');
    }
    this.logger.log(`Deleting Jawaban by id: ${jawabanId}`);
    await this.jawabanService.deleteJawaban(jawabanId);
    return { message: 'Jawaban deleted successfully.' };
  }

  @Get('assesment/:assesmentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Siswa, Role.Admin, Role.Pengajar)
  async getJawabanByAssesmentId(
    @Param('assesmentId') assesmentId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    const assesmentIdNumber = parseInt(assesmentId, 10);
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(assesmentIdNumber)) {
      throw new BadRequestException('assesmentId harus berupa angka');
    }
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page dan limit harus berupa angka');
    }

    this.logger.log(
      `Mengambil Jawaban untuk assesment_id: ${assesmentIdNumber}`,
    );

    return this.jawabanService.getJawabanByAssesmentId(
      assesmentIdNumber,
      pageNumber,
      limitNumber,
      search,
    );
  }

  @Patch(':jawabanId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Pengajar, Role.Admin)
  async assignNilai(
    @Param('jawabanId', ParseIntPipe) jawabanId: number,
    @Body() assignNilaiDto: AssignNilaiDto,
  ) {
    this.logger.log(`Pengajar memberikan nilai kepada Jawaban ID ${jawabanId}`);
    return this.jawabanService.assignNilai(jawabanId, assignNilaiDto);
  }
}
