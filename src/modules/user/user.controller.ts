import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto, UserLoginDto } from "./Dtos/user.dto";
import { GoogleOauthGuard } from "../auth/guards/google-oauth20.guard";
import { FacebookGuard } from "../auth/guards/facebook.guard";

@Controller('user')
export class UsersController{
    constructor(private readonly usersService: UsersService) {}

    @Get()
    message(){
        return 'Hello world';
    }

    @Get('google/redirect')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRes(@Req() req) {
        return this.usersService.googleSignIn(req.user);
    }

    @Get('facebook/redirect')
    @UseGuards(FacebookGuard)
    async facebookAuthRes(@Req() req) {
        // return this.usersService.googleSignIn(req.user);
        console.log(req);
    }

    @Post()
    createUser(@Body() user:UserDto){
        return this.usersService.createUser(user)
    }

    @Post('login')
    async login(@Body() loginDetails: UserLoginDto){
        return this.usersService.loginUser(loginDetails);
    }
}
