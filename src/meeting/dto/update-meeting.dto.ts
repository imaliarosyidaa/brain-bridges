import { IsOptional } from 'class-validator';

export class UpdateMeetingDto {
  @IsOptional()
  judul?: string; // Judul meeting yang bisa diubah

  @IsOptional()
  deskripsi?: string; // Deskripsi meeting yang bisa diubah

  @IsOptional()
  kelasId?: string; // ID kelas yang terkait, jika kelas berubah

  @IsOptional()
  videos?: string; // URL video 1, jika ada perubahan

  @IsOptional()
  files?: string; // URL file materi 1, jika ada perubahan

  @IsOptional()
  summary?: string;
}
