import { IsEmail, IsNotEmpty,Length,MinLength } from "class-validator";
import { UserType } from "../Interface/user.interface";


export class UserDto{
    id: number;
    @MinLength(3)
    firstName: string;
    @MinLength(3)
    lastName: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    phoneNumber: string;
    @Length(8,15)
    password: string;
}
 export class AdminDto{
    @IsEmail()
    email: string;
    @MinLength(3)    
    firstName: string;
    @MinLength(3)
    lastName: string;
    @Length(5)
    Usertype: UserType
 }
