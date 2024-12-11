// src/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  // Endpoint untuk mendapatkan pengguna dengan role "siswa"
  @Get('siswa')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getSiswa(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('SISWA', search);
  }

  // Endpoint untuk mendapatkan pengguna dengan role "pengajar"
  @Get('pengajar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getPengajar(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('PENGAJAR', search);
  }

  // Endpoint untuk mendapatkan pengguna dengan role "admin"
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAdmin(@Query('search') search: string = '') {
    return this.userService.getUsersByRole('ADMIN', search);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Param('id') id: number) {
    const userId = Number(id);
    return this.userService.deleteUser(userId);
  }
}
