import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserInterface } from "src/modules/user/Interface/user.interface";

@Injectable()

    export class NotVerifiedEmailStrategy extends PassportStrategy(Strategy, 'not-verified-email') {
        constructor() {
          super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
          });
        }
        
        async validate (user: UserInterface){
          if (user.isVerified){
            throw new BadRequestException('This user is already verified.');
          }
        return {
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        emailVerified:user.isVerified, 
        phoneNumber: user.phoneNumber 
      };
  }
}