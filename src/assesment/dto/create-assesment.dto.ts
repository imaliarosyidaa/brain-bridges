import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssesmentDto {
  @IsString()
  @IsNotEmpty()
  kelasId: string; // kelas_id tetap string

  @IsString()
  @IsNotEmpty()
  title: string; // title tetap string

  @IsString()
  @IsNotEmpty()
  description: string; // description tetap string

  @IsString()
  @IsNotEmpty()
  deadlines: string; // deadline tetap string

  @IsOptional()
  file1?: string; // file1, file2, file3 menyimpan path file (string)
  @IsOptional()
  file2?: string;
  @IsOptional()
  file3?: string;
}
