import { IsEmail, IsNotEmpty,Length,MinLength } from "class-validator";
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

export class UserAuthDto {
    firstName: string;
    lastName: string;
    email: string;
    picture: string;
}

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 15)
    password: string;
}