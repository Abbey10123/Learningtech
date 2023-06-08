import { IsEmail, IsEnum, IsNotEmpty,Length,MinLength } from "class-validator";
import { Gender, UserType } from "../Interface/user.interface";


export class UserDto{
    id: number;
    @MinLength(3)
    firstName: string;
    @MinLength(3)
    lastName: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    image_url: string;
    @IsNotEmpty()
    phoneNumber: string;
    @IsEnum(Gender)
    gender: Gender;
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
    @IsEnum(UserType)
    usertype: UserType
    }

export class TutorDto{
        id: number;
        @MinLength(3)
        firstName: string;
        @MinLength(3)
        lastName: string;
        @IsEmail()
        email: string;
        @IsNotEmpty()
        image_url: string;
        @IsNotEmpty()
        phoneNumber: string;
        @IsEnum(Gender)
        gender: Gender;
        @IsNotEmpty()
        course: string;
        @IsEnum(UserType)
        usertype: UserType
    
    }

