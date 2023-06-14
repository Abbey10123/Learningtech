import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserInterface, UserType } from "src/modules/user/interface/user.interface";

@Injectable()

    export class TutorStrategy extends PassportStrategy(Strategy, 'tutor') {
        constructor() {
          super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
          });
        }
        
        async validate (user: UserInterface){
          if (UserType.Tutor !== user.userType){
            throw new UnauthorizedException('Not Allowed!!!');
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