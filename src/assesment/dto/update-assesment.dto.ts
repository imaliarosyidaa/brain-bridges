import { IsString, IsOptional } from 'class-validator';

export class UpdateAssesmentDto {
  @IsString()
  @IsOptional()
  kelasId?: string; // kelasId opsional

  @IsString()
  @IsOptional()
  title?: string; // title opsional

  @IsString()
  @IsOptional()
  description?: string; // description opsional

  @IsString()
  @IsOptional()
  deadlines?: string; // deadlines opsional

  @IsOptional()
  file1?: string; // file1 opsional

  @IsOptional()
  file2?: string; // file2 opsional

  @IsOptional()
  file3?: string; // file3 opsional
}
