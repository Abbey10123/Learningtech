import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions';
import { welcome } from 'src/core/helper/email.helper';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/core/helper/otp.helper';
import { UserDto, UserAuthDto, UserLoginDto } from './Dtos/user.dto';
import { OtpReason } from './Interface/otp.interface';
import { OTP_REPOSITORY, USER_REPOSITORY } from 'src/core/constant/constants';



@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) 
        private readonly userRepo: Repository<User>,
        @Inject(OTP_REPOSITORY)
        private readonly otpRepo: Repository<Otp>,
        private readonly jwtService: JwtService
    ){}

    private checkUser(email)
    {
        return this.userRepo.findOneBy({email: email});
    }

    public async googleSignIn(user: UserAuthDto): Promise<any> {
        let foundUser = await this.checkUser(user.email);

        if(!foundUser){
           foundUser = await this.userRepo.save({
                "first_name": user.firstName,
                "last_name": user.lastName,
                "email": user.email,
                "image_Url": user.picture
            });  
        }
        await this.userRepo.update(foundUser.id, {isVerified:  true});

        delete foundUser.password;
        return {
            accessToken: this.jwtService.sign({...foundUser}),
            foundUser
        };
    }

    public async createUser(user: UserDto ){
        try {
            const userExists = await this.checkUser(user.email);
            if(userExists){
                throw 'This User already exists, please proceed to sign-in'
            }
            const encrypt = await bcrypt.hash (user.password, 10);
            user.password = encrypt;
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

    async loginUser(userDetails: UserLoginDto)
    {
        try{
            const found_user = await this.checkUser(userDetails.email);
            if (!found_user)
            {   
                throw 'Invalid credentials';
            }

            if (!found_user.isVerified)
            {
                throw 'This email is not verified, please verify your Email.'
            }

            const isMatch = await bcrypt.compare(userDetails.password, found_user.password);
            if (!isMatch)
            {
                throw 'Invalid credentials';
            }
            const { password, ...userWithoutpassword} = found_user;
            return{
                access_token: this.jwtService.sign({...userWithoutpassword}, { expiresIn: '24h'}),
                userWithoutpassword
            }
        } catch(e)
        {
            throw new UnauthorizedException(e);
        }
    }
}    
