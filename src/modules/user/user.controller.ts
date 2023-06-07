import { Controller, Post, Body, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "./Dtos/user.dto";

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
}
