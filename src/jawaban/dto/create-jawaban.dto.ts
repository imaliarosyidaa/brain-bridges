import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJawabanDto {
  @IsString() // Menerima asesmentId dalam bentuk string
  assesmentId: string;

  @IsString()
  @IsOptional()
  jawaban?: string;

  @IsNumber()
  @IsOptional()
  nilai?: number;

  @IsString()
  @IsOptional()
  file?: string; // Path file yang akan disimpan
}
