import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { welcome } from 'src/core/helper/email.helper';
import { Otp } from './entities/otp.entity';
import { generateOtp } from 'src/core/helper/otp.helper';
import { UserDto, UserAuthDto, UserLoginDto, AdminDto, TutorDto, } from './Dtos/user.dto';
import { OtpReason } from './Interface/otp.interface';
import { message, OTP_REPOSITORY, subject, USER_REPOSITORY } from 'src/core/constant/constants';
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
        private readonly jwtService: JwtService
    ){}

    async checkUser(email)
    {
        return this.userRepo.findOneBy({email: email});
    }

    public async googleSignIn(user: UserAuthDto): Promise<any> {
        let foundUser = await this.checkUser(user.email);

        if(!foundUser){
           foundUser = await this.userRepo.save({
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "image_Url": user.picture
            });  
        }
        await this.userRepo.update(foundUser.id, {isVerified:  true});

        delete foundUser.password;
        return {
            accessToken: this.jwtService.sign({...foundUser}, { expiresIn: '24h'}),
            foundUser
        };
    }

    public async createUser(user: UserDto ){
        try {
            const userExists = await this.checkUser(user.email);
            if(userExists){
                throw 'User exists'
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
                token:this.jwtService.sign({...savedUser}, { expiresIn: '1h'}),
                userDetails: savedUser.id,
                message: "Registration succesful, please check your email for verification!"
            }
        }
        catch (error) {
            throw new UnauthorizedException(error);

    }}
    
    async verifyEmail(user: User, otp: string){
        try{
        const verif = await this.userRepo.findOne({where:{id: user.id}});
        if (verif.isVerified == true){
           throw new UnauthorizedException ({message: "email verified"})}
        
        const recordOtp = await this.otpRepo.findOne({where:{
                userId: user.id,
                otpReason: OtpReason.verifyEmail,
                code: otp,
                expiryDate: MoreThanOrEqual( new Date()),
            }})
            
            if (!recordOtp){
               throw `Invalid Otp`;
            }
        await this.userRepo.update(user.id, {isVerified: true});
            delete user.password;
            welcome(user, message, subject);
            return{message: "Verification successful"}}
        catch(error){
            throw new UnauthorizedException (error)
        }  
    }  


    async loginUser(userDetails: UserLoginDto)
    {
        try{
            const found_user = await this.checkUser(userDetails.email);
            if (!found_user)
            {   
                throw 'Invalid credentials';
            }
            const isMatch = await bcrypt.compare(userDetails.password, found_user.password);
            if (!isMatch)
            {
                throw 'Invalid credentials';
            }

            if (!found_user.isVerified)
            {
                throw 'Email not verified'
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

    async changePass (user: User, details: changePasswordDto)
    {
        try
        {
        const identify = await this.userRepo.findOne({where: {id:user.id}});
        if (!(await bcrypt.compare(details.oldPassword, identify.password)))
        {
        throw 'Incorrect password';
        }
        identify.password = await bcrypt.hash(details.newPassword, 10);
        await this.userRepo.save(identify);
        return {message:'Your password has been updated'}
        }
        catch (error)
        {
        throw new UnauthorizedException (error)
        }
    }

    public async forgotPassword(email)
    {
        try
        {
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
                token: this.jwtService.sign({...myEmail}, { expiresIn: '15m'}),
                savedUser: myEmail.email,
                message: `Reset email sent successfully`
            };
        }
         catch (error) 
         {
            throw new UnauthorizedException (error);
         }
    } 

    public async enterOtp(otp, user: User){ 
        try{
        const realUser = await this.userRepo.findOne({where: {id: user.id}})
        if (!realUser){ 
            throw new UnauthorizedException ({message: 'user not found'})
        }
        const checkOtp = await this.otpRepo.findOne(
            {
                where: 
                { 
                    userId: user.id, 
                    code:otp, 
                    otpReason: OtpReason.resetPassword, 
                    expiryDate: MoreThanOrEqual( new Date())
                }
            }
            )
        if (!checkOtp) {
            throw new UnauthorizedException({message: "Invalid Otp"})
        }
        return {message: "please enter a new password"}}
        catch (error){
            throw new UnauthorizedException (error)
        }
    }  

    public async newPass (user: User, details: newPasswordDto )
    {
        try 
        {
            const foundUser = await this.userRepo.findOne({where:{id: user.id}});
            if (!foundUser)
            {
                return{message: "User not found"};
            }
            if (details.newPassword !== details.confirmNewPassword)
            {
                throw 'new password does not match';
                
            }
            foundUser.password = await bcrypt.hash(details.newPassword, 10);
            await this.userRepo.save(foundUser);
            return "New password updated";
        }
        catch (error)
        {
            throw new UnauthorizedException (error);
        }
    }   

    public async createAdmin(user: AdminDto)
    {
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
            throw new UnauthorizedException (error);
        }
    }

    public async createTutor(user: TutorDto)
    {
        try 
        {
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
       
        catch (error)
        {
        throw new UnauthorizedException(error)
        };
    }

}
