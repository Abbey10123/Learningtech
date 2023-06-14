import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './user.controller';
import { otpsProvider, usersProvider } from './user.provider';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/core/database/database.module';
dotenv.config();

@Module({
  imports:[DatabaseModule, AuthModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
  controllers: [UsersController],
  providers: [{provide: UsersService, useClass: UsersService}, ...usersProvider, ...otpsProvider]
})
export class UsersModule {}
