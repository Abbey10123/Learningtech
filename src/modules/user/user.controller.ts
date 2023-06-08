import { Controller, Post, Body, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AdminDto, UserDto } from "./Dtos/user.dto";
import { ForgotPasswordDto, newPasswordDto } from "./Dtos/forget.dto";
import { ForgotPassGuard } from "src/core/guards/forgot-pass-guard";

@Controller('user')
export class UsersController{
    constructor(private readonly usersService: UsersService) {}

    @Get()
    message(){
        return 'Hello world';}

    @Post()
    createUser(@Body() user:UserDto){
        return this.usersService.createUser(user)
    }
    @Post('forgot-password')
    forgotPassword(@Body() user:ForgotPasswordDto){
        return this.usersService.forgotPassword(user.email)
    }

    @UseGuards(ForgotPassGuard)
    @Post('forgot-password/otp')
    enterOtp(@Body('otp') otp: string, @Req() req){
        return this.usersService.enterOtp(otp, req.user)
    }
    
    @UseGuards(ForgotPassGuard)
    @Post('update-password')
    newPass(@Body() details: newPasswordDto, @Req() req){
        return this.usersService.newPass(req.user, details)
    }
    @Post('admin')
    createAdmin(@Body() user:AdminDto){
        return this.usersService.createAdmin(user)
    }
}
