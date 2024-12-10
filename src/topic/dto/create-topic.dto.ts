// src/topic/dto/create-topic.dto.ts
import { IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  name: string;
}
