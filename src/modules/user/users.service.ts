import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { welcome } from 'src/core/helper/email.helper';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/core/helper/otp.helper';
import { UserDto } from './Dtos/user.dto';
import { OtpReason } from './Interface/otp.interface';
import { OTP_REPOSITORY, USER_REPOSITORY } from 'src/core/constant/constants';
import { newPasswordDto } from './Dtos/forget.dto';



@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) 
        private readonly userRepo: Repository<User>,
        @Inject(OTP_REPOSITORY)
        private readonly otpRepo: Repository<Otp>,
        private jwtService: JwtService
    ){}

    private checkUser(email)
    {
        return this.userRepo.findOneBy({email: email});
    }

    async createUser(user: UserDto ){
        try {
            const userExists = await this.checkUser(user.email);
            if(userExists){
                throw 'This User already exists, please proceed to sign-in'
            }
            const ecrypt = await bcrypt.hash (user.password, 10);
            user.password = ecrypt;
            const savedUser = await this.userRepo.save(user);
            const getOtp = generateOtp();
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes()+30);
            const newOtp = this.otpRepo.create({
             code: getOtp.toString(),
             userId: user.id,
             otpReason: OtpReason.verifyEmail,
             expiryDate: expiry});
            const savedOtp = await this.otpRepo.save(newOtp)
            const verifyMessage = `Please input this verification code ${savedOtp.code}`;
            const subjectMessage = `Please Verify`;
            welcome(savedUser, verifyMessage, subjectMessage)
            delete savedUser.password;
            return {
                token:this.jwtService.sign({...savedUser}),
                userDetails: savedUser,
                message: "Registration succesful, please check your email for verification!"
            }
        }
        catch (error) {
            throw new BadRequestException(error);

    }}

    async forgotPassword(email){
        try{
            const myEmail = await this.userRepo.findOne({where:{email: email}});
            if (!myEmail) {
                throw `This user does not exist`   
            };
            const otpGen = generateOtp();
            const expiry = new Date();
            expiry.setMinutes(expiry.getMinutes()+10);
            const updateOtp = this.otpRepo.create({
                code: otpGen.toString(),
                userId: myEmail.id,
                otpReason: OtpReason.resetPassword,
                expiryDate: expiry})
            const savedNewOtp = this.otpRepo.save(updateOtp);
            const message = `Please input this verification code ${(await savedNewOtp).code} to reset your password`;
            const subject = `Password Reset`;
            welcome(myEmail, message, subject);
            return {
                token: this.jwtService.sign({...myEmail}),
                savedUser: myEmail.email,
                message: `Reset email sent successfully`};}
     catch (error) {throw new BadRequestException (error);}
    } 

    async enterOtp(otp, user: User){ 
        try{
        const realUser = await this.userRepo.findOne({where: {id: user.id}})
        if (!realUser){ 
            throw new BadRequestException ({message: 'user not found'})
        }
        const checkOtp = await this.otpRepo.findOne({where:{ userId: user.id, code:otp, otpReason: OtpReason.resetPassword, expiryDate: MoreThanOrEqual( new Date())}})
        if (!checkOtp) {
            throw new BadRequestException({message: "Invalid Otp"})
        }
        return {message: "please enter a new password"}}
        catch (error){
            throw new BadRequestException (error)
        }
    }  


    async newPass (user: User, details: newPasswordDto ){
        try{
        const foundUser = await this.userRepo.findOne({where:{id: user.id}});
        if (!foundUser){
            return{message: "User not found"};
        }
       if (details.newPassword !== details.confirmNewPassword){
            throw new BadRequestException ({message: 'new password does not match'});};
    foundUser.password = await bcrypt.hash(details.newPassword, 10) ;
    await this.userRepo.save(foundUser) ;
            return {message: "New password updated"} }
        catch (error){
            throw new BadRequestException (error)
        }    
    }
}    
