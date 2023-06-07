import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { welcome } from 'src/core/helper/email.helper';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/core/helper/otp.helper';
import { UserDto } from './Dtos/user.dto';
import { OtpReason } from './Interface/otp.interface';
import { OTP_REPOSITORY, USER_REPOSITORY } from 'src/core/constant/constants';



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
}    
