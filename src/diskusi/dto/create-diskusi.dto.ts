import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiskusiDto {
  @IsNotEmpty()
  kelas_id: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  parent_id?: number; // Opsional, hanya diperlukan jika ini adalah balasan
}
