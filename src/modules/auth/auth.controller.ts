import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards/google-oauth20.guard';
import { FacebookGuard } from './guards/facebook.guard';

@Controller('auth')
export class AuthController {
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async auth(){}

    @Get('facebook')
    @UseGuards(FacebookGuard)
    async authFacebook(){}
}
