import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { KelasSiswaService } from './kelassiswa.service';

@Controller('api/kelas-siswa')
export class KelasSiswaController {
  constructor(private readonly kelasSiswaService: KelasSiswaService) {}

  // Mendapatkan kelas siswa berdasarkan ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa) // Role yang bisa akses
  async getKelasSiswaById(@Param('id') id: string, @Req() req: any) {
    try {
      const kelasSiswa = await this.kelasSiswaService.getKelasSiswaById(id);
      return kelasSiswa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Kelas Siswa not found.');
      }
      throw error; // Rethrow error jika bukan NotFoundException
    }
  }

  // Mendapatkan kelas siswa berdasarkan userId
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa)
  async getKelasSiswaByUserId(@Param('userId') userId: string, @Req() req: any) {
    try {
      const kelasSiswa = await this.kelasSiswaService.getKelasSiswaByUserId(userId);
      return kelasSiswa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Kelas Siswa not found for this user.');
      }
      throw error;
    }
  }

  // Mendapatkan kelas siswa berdasarkan kelasId
  @Get('kelas/:kelasId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar, Role.Siswa)
  async getKelasSiswaByKelasId(@Param('kelasId') kelasId: string, @Req() req: any) {
    try {
      const kelasSiswa = await this.kelasSiswaService.getKelasSiswaByKelasId(kelasId);
      return kelasSiswa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Kelas Siswa not found for this class.');
      }
      throw error;
    }
  }

  // Mendapatkan semua kelas siswa
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Hanya admin yang bisa mengakses
  async getAllKelasSiswa(@Req() req: any) {
    try {
      const kelasSiswa = await this.kelasSiswaService.getAllKelasSiswa();
      return kelasSiswa;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('No Kelas Siswa found.');
      }
      throw error;
    }
  }
}
