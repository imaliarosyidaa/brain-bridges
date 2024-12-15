import { IsString, IsOptional } from 'class-validator';

export class UpdateKelasSiswaDto {
  @IsString()
  @IsOptional()
  id?: string; // id opsional

  @IsString()
  @IsOptional()
  kelasId?: string; // kelasId opsional

  @IsString()
  @IsOptional()
  userId?: string; // userId opsional
}
