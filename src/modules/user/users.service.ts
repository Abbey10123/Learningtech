import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { welcome } from 'src/core/helper/email.helper';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/core/helper/otp.helper';
import { AdminDto, TutorDto, UserDto } from './Dtos/user.dto';
import { OtpReason } from './Interface/otp.interface';
import { OTP_REPOSITORY, USER_REPOSITORY } from 'src/core/constant/constants';
import { newPasswordDto } from './Dtos/forget.dto';
import { UserType } from './Interface/user.interface';
import { generatePassword } from 'src/core/helper/password-generator.helper';
import { changePasswordDto } from './Dtos/change-pass.dto';



@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) 
        private readonly userRepo: Repository<User>,
        @Inject(OTP_REPOSITORY)
        private readonly otpRepo: Repository<Otp>,
        private jwtService: JwtService
    ){}

    async checkUser(email)
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

    async createAdmin(user: AdminDto){
        try{
         if (user.usertype == UserType.Admin){
        const existingAdmin = await this.checkUser(user.email);
        if(existingAdmin) {
            throw 'Please login'}
        const adminPass = generatePassword(8);
        const encryptPass = await bcrypt.hash (adminPass, 10)
        const newAdmin = this.userRepo.create({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.usertype,
            password: encryptPass
        });
        const savedAdmin = await this.userRepo.save(newAdmin);
        const adminSubj = 'Welcome Administrator';
        const adminMssg = `You are welcome to TalentDev ${savedAdmin.firstName}, Kindly use these informations to login to your account;"Email: ${savedAdmin.email}, Password: ${adminPass}"`;
        welcome(savedAdmin, adminMssg, adminSubj);
        return "Admin successful created"
        }
        throw "Not allowed";
        }
        catch (error){
            throw new BadRequestException (error);
        }
    }

    async createTutor(user: TutorDto){
        try {
            if (user.usertype == UserType.Tutor){
            const existingTutor = await this.checkUser(user.email);
            if(existingTutor){
              throw "Inform Tutor to login"
            };
            
            const tutorPass = generatePassword(8);
            const hiddenPass = await bcrypt.hash(tutorPass, 10);
            const newTutor = this.userRepo.create({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              gender: user.gender,
              image_url: user.image_url,
              userType: user.usertype,
              phoneNumber: user.phoneNumber,
              password: hiddenPass,
              course: user.course
            });
            const savedTutor = await this.userRepo.save(newTutor);
            const subJ = "Welcome Facilitator";
            const msg = `Hello ${savedTutor.firstName},you have been registered as a facilitator for ${savedTutor.course} on Talent Dev.Kindly use the following details to login to your dashboard."Email: ${savedTutor.email}, Password: ${tutorPass}"`;
            welcome( savedTutor, subJ, msg);
            return "Tutor registered"}
            throw "Not allowed"
        }
       
        catch (error){
        throw new BadRequestException(error)};
    }
    async changePass (user: User, details: changePasswordDto){
        try{
        const identify = await this.userRepo.findOne({where: {id:user.id}});
        if (!identify){
        throw new BadRequestException ({message: 'User not found'})};
        if (!(await bcrypt.compare(details.oldPassword, identify.password))){
        throw new BadRequestException ({message:'Old password is incorrect'});}
        if (details.newPassword !== details.confirmNewPassword){
        throw new BadRequestException ({message: 'new password does not match'});}
        identify.password = await bcrypt.hash(details.newPassword, 5);
    await this.userRepo.save(identify);
    return {message:'Your password has been updated'}}
    catch (error){
        throw new BadRequestException (error)
    }}
    


}
