import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class ForgotPasswordDto{
    @IsNotEmpty()
    @IsEmail()  
    email: string;
}

export class newPasswordDto{
    @Length(8,15)
    newPassword: string;
    @Length(8,15)
    confirmNewPassword: string;

}