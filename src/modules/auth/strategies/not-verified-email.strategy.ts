import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/user/entities/user.entity";
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
        
        async validate (user: User){
          
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