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
