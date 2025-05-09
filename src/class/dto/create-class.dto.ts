// src/class/dto/create-class.dto.ts
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pengajar_id?: number;

  @IsInt()
  @Min(1)
  @Max(3)
  topic_id: number;
}
