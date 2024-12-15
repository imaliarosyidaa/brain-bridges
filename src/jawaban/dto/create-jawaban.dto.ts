import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateJawabanDto {
  @IsNotEmpty() // Menerima asesmentId dalam bentuk string
  assesmentId: string;

  @IsNotEmpty()
  siswaId: string;

  @IsString()
  @IsOptional()
  jawaban?: string;

  @IsString()
  @IsOptional()
  file?: string; // Path file yang akan disimpan
}
