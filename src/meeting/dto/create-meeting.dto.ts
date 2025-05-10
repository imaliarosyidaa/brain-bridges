import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  kelasId: string;

  @IsNotEmpty()
  @IsString()
  tittle: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  videos?: string[];
  files?: string[];
}
