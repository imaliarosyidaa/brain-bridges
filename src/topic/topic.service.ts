/* eslint-disable @typescript-eslint/no-unused-vars */
// src/topic/topic.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Topic (Admin only)
  async createTopic(createTopicDto: CreateTopicDto) {
    try {
      const newTopic = await this.prisma.topic.create({
        data: {
          name: createTopicDto.name,
        },
      });
      return newTopic;
    } catch (error) {
      throw new Error('Failed to create topic');
    }
  }

  // Get Topic by ID
  async getTopicById(id: number) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return topic;
  }

  // Update Topic (Admin only)
  async updateTopic(id: number, updateTopicDto: UpdateTopicDto) {
    const { name } = updateTopicDto;

    try {
      const updatedTopic = await this.prisma.topic.update({
        where: { id },
        data: {
          name,
        },
      });

      return updatedTopic;
    } catch (error) {
      throw new NotFoundException('Topic not found or update failed');
    }
  }

  // Delete Topic (Admin only)
  async deleteTopic(id: number) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    await this.prisma.topic.delete({
      where: { id },
    });

    return { status: 'success', message: 'Topic deleted successfully' };
  }

  // Get all topics (Admin only)
  async getAllTopics() {
    return await this.prisma.topic.findMany();
  }
}
