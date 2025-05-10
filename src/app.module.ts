import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Controller } from './s3/s3.controller';
import { S3Service } from './s3/s3.service';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ClassModule } from './class/class.module';
import { MeetingModule } from './meeting/meeting.module';
import { AssesmentModule } from './assesment/assesment.module';
import { ProfileModule } from './profile/profile.module';
import { JawabanModule } from './jawaban/jawaban.module';
import { TopicModule } from './topic/topic.module';
import { DiskusiModule } from './diskusi/diskusi.module';
import { KelasSiswaModule } from './kelas_siswa/kelassiswa.module';

@Module({
  imports: [
    AuthModule,
    BookModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // Menyajikan dari uploads di root proyek
      serveRoot: '/uploads', // Prefix URL untuk mengakses file
      exclude: ['/api*'], // Mengecualikan rute API dari penyajian statis
    }),
    UserModule,
    ClassModule,
    MeetingModule,
    AssesmentModule,
    ProfileModule,
    JawabanModule,
    TopicModule,
    DiskusiModule,
    KelasSiswaModule,
  ],
  controllers: [AppController, S3Controller],
  providers: [AppService, S3Service],
})
export class AppModule {}
