// src/user/dto/get-users.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsString()
  search?: string;
}
