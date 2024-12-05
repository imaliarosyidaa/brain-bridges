import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateJawabanDto {
  @IsString() // Menerima asesmentId dalam bentuk string
  @IsOptional()
  assesmentId?: string;

  @IsString()
  @IsOptional()
  jawaban?: string;

  @IsNumber()
  @IsOptional()
  nilai?: number;

  @IsString()
  @IsOptional()
  file?: string; // Path file yang akan disimpan jika diupdate
}
