import { isNumber, Length } from "class-validator";

export class changePasswordDto{
    @Length(8,15)
    oldPassword: string;
    @Length(8,15)
    newPassword: string;
    @Length(8,15)
    confirmNewPassword: string
}
