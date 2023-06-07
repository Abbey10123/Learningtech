import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { UsersController } from './user.controller';
import { otpsProvider, usersProvider } from './user.provider';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/core/database/database.module'; 
import { ForgotPassGuardStrategy } from 'src/core/strategies/forgot-pass-guard.strategy';
dotenv.config();

@Module({
  imports:[DatabaseModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
  controllers: [UsersController],
  providers: [{provide: UsersService, useClass: UsersService}, ForgotPassGuardStrategy, ...usersProvider, ...otpsProvider]
})
export class UsersModule {}
