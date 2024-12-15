// src/topic/topic.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('api/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  // Create Topic (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createTopic(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.createTopic(createTopicDto);
  }

  // Get all topics (Admin only)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async getAllTopics() {
    return this.topicService.getAllTopics();
  }

  // Get Topic by ID (Admin only)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async getTopicById(@Param('id') id: number) {
    const topicId = Number(id);
    return this.topicService.getTopicById(topicId);
  }

  // Update Topic (Admin only)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateTopic(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    const topicId = Number(id);
    return this.topicService.updateTopic(topicId, updateTopicDto);
  }

  // Delete Topic (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteTopic(@Param('id') id: number) {
    const topicId = Number(id);
    return this.topicService.deleteTopic(topicId);
  }
}
