import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateJawabanDto {
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
