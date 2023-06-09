import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { otpsProvider, usersProvider } from './user.provider';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/core/database/database.module'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule, DatabaseModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
  controllers: [UsersController],
  providers: [UsersService, ...usersProvider, ...otpsProvider]
})
export class UsersModule {}
