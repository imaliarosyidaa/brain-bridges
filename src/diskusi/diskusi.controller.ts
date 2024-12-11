// src/diskusi/diskusi.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { DiskusiService } from './diskusi.service';
import { CreateDiskusiDto } from './dto/create-diskusi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/diskusi')
@UseGuards(JwtAuthGuard) // Terapkan guard untuk semua endpoint di controller ini
export class DiskusiController {
  constructor(private readonly diskusiService: DiskusiService) {}

  // Endpoint untuk membuat komentar atau balasan
  @Post()
  async createDiskusi(@Body() createDiskusiDto: CreateDiskusiDto, @Req() req) {
    const userEmail = req.user.email;
    createDiskusiDto.kelas_id = Number(createDiskusiDto.kelas_id);
    if (createDiskusiDto.parent_id) {
      createDiskusiDto.parent_id = Number(createDiskusiDto.parent_id);
    }
    return this.diskusiService.createDiskusi(createDiskusiDto, userEmail);
  }

  // Endpoint untuk mendapatkan semua komentar dan balasannya berdasarkan kelas
  @Get('kelas/:id')
  async getDiskusiByKelas(@Param('id', ParseIntPipe) kelasId: number) {
    return this.diskusiService.getDiskusiByKelas(kelasId);
  }
}
