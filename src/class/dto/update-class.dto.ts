// src/class/dto/update-class.dto.ts
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pengajar_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  topic_id?: number;
}
