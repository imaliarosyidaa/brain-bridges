import { IsString, IsNotEmpty } from 'class-validator';

export class CreateKelasSiswaDto {
  @IsString()
  @IsNotEmpty()
  id: string; // id tetap string

  @IsString()
  @IsNotEmpty()
  kelasId: string; // kelas_id tetap string

  @IsString()
  @IsNotEmpty()
  userId: string; // user_id tetap string
}
