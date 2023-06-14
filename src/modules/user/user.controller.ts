import { Controller, Post, Body, Get, Req, UseGuards, Patch, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto, UserLoginDto, AdminDto, TutorDto } from "./Dtos/user.dto";
import { GoogleOauthGuard } from "../auth/guards/google-oauth20.guard";
import { FacebookGuard } from "../auth/guards/facebook.guard";
import { ForgotPasswordDto, newPasswordDto } from "./Dtos/forget.dto";
import { changePasswordDto } from "./Dtos/change-pass.dto";
import { VerifiedEmailGuard } from "../auth/guards/verified-email.guard";
import { AdminAccess } from "../auth/guards/admin-access.guard";
import { NotVerifiedEmailGuard } from "../auth/guards/not-verified-email.guard";

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
       return this.usersService.googleSignIn(req.user);
    }

    @Post()
    createUser(@Body() user:UserDto){
        return this.usersService.createUser(user)
    }
   
    @Patch("verify-email/:otp")
    @UseGuards(NotVerifiedEmailGuard)
    verifyEmail(@Param ('otp') otp:string, @Req() req){
       return this.usersService.verifyEmail(req.user, otp)
    }

    @Post('login')
    async login(@Body() loginDetails: UserLoginDto){
        return this.usersService.loginUser(loginDetails);
    }
    @Post('forgot-password')
    forgotPassword(@Body() user:ForgotPasswordDto){
        return this.usersService.forgotPassword(user.email)
    }

    @UseGuards(VerifiedEmailGuard)
    @Post('forgot-password/otp')
    enterOtp(@Body('otp') otp: string, @Req() req){
        return this.usersService.enterOtp(otp, req.user)
    }
    
    @UseGuards(VerifiedEmailGuard)
    @Post('update-password')
    newPass(@Body() details: newPasswordDto, @Req() req){
        return this.usersService.newPass(req.user, details)
    }
    @Post('admin')
    createAdmin(@Body() user:AdminDto){
        return this.usersService.createAdmin(user)
    }
    @UseGuards(AdminAccess)
    @Post('facilitator')
    createTutor(@Body() user: TutorDto){
        return this.usersService.createTutor(user)
    }
    @UseGuards(VerifiedEmailGuard)
    @Patch('change-password')
    changePass(@Body() details: changePasswordDto , @Req()request:any){
        return this.usersService.changePass(request.user, details)
     }
}
