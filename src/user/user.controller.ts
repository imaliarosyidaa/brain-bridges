// src/user/user.controller.ts
import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint untuk mendapatkan pengguna dengan role "siswa"
  @Get('siswa')
  async getSiswa(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('SISWA', search);
  }

  // Endpoint untuk mendapatkan pengguna dengan role "pengajar"
  @Get('pengajar')
  async getPengajar(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('PENGAJAR', search);
  }

  // Endpoint untuk mendapatkan pengguna dengan role "admin"
  @Get('admin')
  async getAdmin(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('ADMIN', search);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const userId = Number(id);
    return this.userService.deleteUser(userId);
  }
}
