import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/user/user.module';
import { CourseModule } from './modules/course/course.module';
import { AuthModule } from './modules/auth/auth.module';



@Module({
  imports: 
  [
    DatabaseModule,
    UsersModule,
    CourseModule,
    AuthModule,
  ]
})
export class AppModule {}