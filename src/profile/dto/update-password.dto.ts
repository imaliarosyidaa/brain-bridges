import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Old password must be at least 6 characters long.' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 6 characters long.' })
  newPassword: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
