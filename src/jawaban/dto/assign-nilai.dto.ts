// src/nilai/dto/assign-nilai.dto.ts
import { IsInt, Min, Max } from 'class-validator';

export class AssignNilaiDto {
  @IsInt({ message: 'Nilai harus berupa angka integer.' })
  @Min(0, { message: 'Nilai tidak boleh kurang dari 0.' })
  @Max(100, { message: 'Nilai tidak boleh lebih dari 100.' })
  nilai: number;
}
