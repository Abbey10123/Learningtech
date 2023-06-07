import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/user/user.module';
import { CourseModule } from './modules/course/course.module';



@Module({
  imports: 
  [
    ConfigModule.forRoot({isGlobal: true,}),
    DatabaseModule,
    UsersModule,
    CourseModule,
  ]
})
export class AppModule {}