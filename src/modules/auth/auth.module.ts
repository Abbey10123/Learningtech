import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookGuard } from './guards/facebook.guard';
import { GoogleOauthGuard } from './guards/google-oauth20.guard';

@Module({
  controllers: [AuthController],
  providers: [FacebookStrategy, GoogleStrategy, FacebookGuard, GoogleOauthGuard],
  exports: [FacebookStrategy, GoogleStrategy, FacebookGuard, GoogleOauthGuard],
})
export class AuthModule {}
