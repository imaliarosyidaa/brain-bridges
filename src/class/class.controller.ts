// src/class/class.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Put,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Auth guard untuk memastikan pengguna terautentikasi
import { RolesGuard } from 'src/auth/guards/roles.guard'; // Guard untuk mengecek role pengguna
import { Roles } from 'src/auth/decorator/roles.decorator'; // Decorator untuk menentukan role yang diperlukan
import { Role } from '../auth/enum/role.enum';
import { UpdateClassDto } from './dto/update-class.dto';
import { AnggotaDto } from './dto/anggota.dto';

@Controller('api/')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  // Create Class (Admin only)
  @Post('class')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async createClass(@Body() createClassDto: CreateClassDto, @Request() req) {
    const user = req.user;
    const userEmail = user.email; // Retrieve the email from req.user

    console.log('Authenticated user email:', userEmail);

    // Call the service, passing the DTO and user email
    return this.classService.createClass(createClassDto, userEmail);
  }

  // Update Class (Admin, Pengajar only)
  @Put('class/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Admin dan Pengajar yang bisa mengubah kelas
  async updateClass(
    @Param('id') id: number,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const kelasId = Number(id);
    return this.classService.updateClass(kelasId, updateClassDto);
  }

  // Get Class by ID (Siswa, Pengajar, Admin)
  @Get('class/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa) // Admin, Pengajar, dan Siswa dapat mengakses
  async getClassById(@Param('id') id: number) {
    const kelasId = Number(id);
    return this.classService.getClassById(kelasId);
  }

  // Get All Classes with Search (Siswa, Pengajar, Admin)
  @Get('class')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa) // Semua bisa akses, dengan pembatasan search
  async getAllClasses(@Query('search') search: string) {
    return this.classService.getAllClassesWithSearch(search);
  }

  // Delete Class (Admin only)
  @Delete('class/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Hanya Admin yang bisa menghapus kelas
  async deleteClass(@Param('id') id: number) {
    const kelasId = Number(id);
    return this.classService.deleteClass(kelasId);
  }

  @Post('class/join/:kelasId')
  @UseGuards(JwtAuthGuard)
  async joinClass(@Req() req, @Param('kelasId') kelasId: string) {
    const userEmail = req.user.email; // Ambil email dari request user yang sudah terautentikasi
    return await this.classService.joinClass(userEmail, kelasId);
  }

  // Endpoint untuk leave class
  @Delete('class/leave/:kelasId')
  @UseGuards(JwtAuthGuard)
  async leaveClass(@Req() req, @Param('kelasId') kelasId: string) {
    const userEmail = req.user.email; // Ambil email dari request user yang sudah terautentikasi
    return await this.classService.leaveClass(userEmail, kelasId);
  }

  @Get('class/:kelasId/anggota')
  async getSiswaByKelasId(
    @Param('kelasId', ParseIntPipe) kelasId: number,
  ): Promise<AnggotaDto[]> {
    return this.classService.getSiswaByKelasId(kelasId);
  }
}
