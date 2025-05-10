/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import path, { resolve } from 'path';
import fs, { accessSync, constants, unlinkSync } from 'fs';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { join } from 'path';

@Injectable()
export class MeetingService {
  private readonly logger = new Logger(MeetingService.name);

  constructor(private prisma: PrismaService) {}

  async createMeeting(createMeetingDto: CreateMeetingDto, user: any): Promise<Meeting> {
    this.logger.log('Processing meeting creation...');

    const { kelasId, ...meetingData } = createMeetingDto;
    this.logger.log('Extracted kelasId: ', kelasId);
    const kelasIdInt = Number(kelasId);

    // Log kelasId conversion
    this.logger.log(`Converted kelasId to integer: ${kelasIdInt}`);
    if (isNaN(kelasIdInt)) {
      this.logger.error('Invalid kelasId: Should be an integer');
      throw new ForbiddenException('Kelas tidak ditemukan.');
    }

    // Fetch class with pengajar info
    const kelas = await this.prisma.class.findUnique({
      where: { id: kelasIdInt },
      include: { pengajar: true },
    });

    // Log class and pengajar info
    this.logger.log('Fetched kelas from database: ', kelas);
    if (!kelas) {
      this.logger.error('Class not found!');
      throw new ForbiddenException('Kelas tidak ditemukan.');
    }

    // Get user id from email
    const userFromDb = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userFromDb) {
      this.logger.error('User not found by email');
      throw new ForbiddenException('User tidak ditemukan.');
    }

    // Check role and access rights
    if (
      user.role !== 'ADMIN' &&
      (user.role !== 'PENGAJAR' || kelas.pengajar.id !== userFromDb.id)
    ) {
      this.logger.error(
        'User does not have permission to access this class',
        user,
      );
      throw new ForbiddenException('Anda tidak memiliki akses.');
    }

    // Log the data that will be saved to the database
    this.logger.log('Saving meeting data to database...', meetingData);

    // Create the meeting record
    const meeting = await this.prisma.meeting.create({
      data: {
        kelas: {
          connect: { id: kelasIdInt },
        },
        ...meetingData, // Ini akan memasukkan semua properti dari meetingData, termasuk videos
      },
    });

    this.logger.log('Meeting successfully created: ', meeting);
    return meeting;
  }

  async getMeetingsByClassId(kelasId: number) {
    this.logger.log(`Fetching meetings for classId: ${kelasId}`);
    // Fetch meetings associated with the class ID
    const meetings = await this.prisma.meeting.findMany({
      where: { kelas_id: kelasId },
      include: { kelas: true }, // Include class details if needed
    });

    if (meetings.length === 0) {
      this.logger.error(`No meetings found for class ID: ${kelasId}`);
      throw new ForbiddenException(
        'Tidak ada pertemuan ditemukan untuk kelas ini.',
      );
    }

    return meetings;
  }

  async getMeetingById(id: number) {
    return this.prisma.meeting.findUnique({
      where: { id },
      include: { kelas: true },
    });
  }

  async updateMeeting(
    meetingId: number,
    updateMeetingDto: UpdateMeetingDto,
  ) {
    this.logger.log(`Processing update for meeting ID: ${meetingId}`);

    const meetingData = { ...updateMeetingDto };

    // Fetch existing meeting data
    const existingMeeting = await this.prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!existingMeeting) {
      this.logger.error('Meeting not found!');
      throw new ForbiddenException('Meeting tidak ditemukan.');
    }

    // Update data meeting di database
    const updatedMeeting = await this.prisma.meeting.update({
      where: { id: meetingId },
      data: meetingData,
    });

    this.logger.log('Meeting successfully updated', updatedMeeting);
    return updatedMeeting;
  }

  async deleteMeeting(id: number) {
    return this.prisma.meeting.delete({
      where: { id },
    });
  }
}
