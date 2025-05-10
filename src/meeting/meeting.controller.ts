import {
  Controller,
  Post,
  Body,
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
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { MeetingService } from './meeting.service';

@Controller('api/meeting')
export class MeetingController {
  private readonly logger = new Logger(MeetingController.name);

  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async updateMeeting(
    @Param('id') id: number,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    this.logger.log(`Received update request for meeting ID: ${id}`);

    // Update meeting with files
    const meetingId = Number(id);
    return this.meetingService.updateMeeting(
      meetingId,
      updateMeetingDto
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
