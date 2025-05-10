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

  @IsNotEmpty()
  @IsString()
  videos: string;

  @IsNotEmpty()
  @IsString()
  files: string;
}
