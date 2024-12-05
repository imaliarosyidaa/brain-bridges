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

  vidio1: string;
  title_vid1: string;
  vidio2?: string;
  title_vid2?: string;
  vidio3?: string;
  title_vid3?: string;
  file_materi1: string;
  file_materi2?: string;
  file_materi3?: string;
}
