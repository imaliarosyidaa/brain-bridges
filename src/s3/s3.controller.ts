import { Controller, Post, Body, UseGuards} from '@nestjs/common';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('api/s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Pengajar)
  async getUploadUrl(@Body() body: { fileName: string; fileType: string; type: string }) {
    return this.s3Service.getPresignedUrl(body.fileName, body.fileType, body.type);
  }
}
