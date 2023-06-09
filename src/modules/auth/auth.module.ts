import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookGuard } from './guards/facebook.guard';
import { GoogleOauthGuard } from './guards/google-oauth20.guard';
import { NotVerifiedEmailGuard } from './guards/not-verified-email.guard';
import { NotVerifiedEmailStrategy } from './strategies/not-verified-email.strategy';
import { VerifiedEmailGuard } from './guards/verified-email.guard';
import { VerifiedEmailStrategy } from './strategies/verified-email.strategy';
import { TutorStrategy } from './strategies/tutor-access.strategy';
import { TutorAccess } from './guards/tutor-access.guard';
import { AdminAccess } from './guards/admin-access.guard';
import { AdminStrategy } from './strategies/admin-access.strategy';

@Module({
  controllers: [AuthController],
  providers: [FacebookStrategy, GoogleStrategy, FacebookGuard, GoogleOauthGuard, NotVerifiedEmailGuard, NotVerifiedEmailStrategy, VerifiedEmailGuard, VerifiedEmailStrategy,TutorAccess ,TutorStrategy, AdminAccess, AdminStrategy],
  exports: [FacebookStrategy, GoogleStrategy, FacebookGuard, GoogleOauthGuard, NotVerifiedEmailGuard, NotVerifiedEmailStrategy, VerifiedEmailGuard, VerifiedEmailStrategy,TutorAccess ,TutorStrategy, AdminAccess, AdminStrategy],
})
export class AuthModule {}
