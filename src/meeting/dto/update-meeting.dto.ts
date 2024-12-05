import { IsOptional } from 'class-validator';

export class UpdateMeetingDto {
  @IsOptional()
  judul?: string; // Judul meeting yang bisa diubah

  @IsOptional()
  deskripsi?: string; // Deskripsi meeting yang bisa diubah

  @IsOptional()
  kelasId?: string; // ID kelas yang terkait, jika kelas berubah

  @IsOptional()
  vidio1?: string; // URL video 1, jika ada perubahan

  @IsOptional()
  file_materi1?: string; // URL file materi 1, jika ada perubahan

  @IsOptional()
  vidio2?: string; // URL video 2, jika ada perubahan

  @IsOptional()
  file_materi2?: string; // URL file materi 2, jika ada perubahan

  @IsOptional()
  vidio3?: string; // URL video 3, jika ada perubahan

  @IsOptional()
  file_materi3?: string; // URL file materi 3, jika ada perubahan
}
