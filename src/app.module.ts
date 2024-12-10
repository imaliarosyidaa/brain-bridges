import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    AuthModule,
    BookModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Mengarah ke folder uploads yang ada di luar dist
      serveRoot: '/uploads', // URL yang bisa diakses
    }),
    UserModule,
    ClassModule,
    MeetingModule,
    AssesmentModule,
    ProfileModule,
    JawabanModule,
    TopicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
