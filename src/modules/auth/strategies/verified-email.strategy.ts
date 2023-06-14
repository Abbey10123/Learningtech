import { UnauthorizedException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserInterface } from "src/modules/user/interface/user.interface";

@Injectable()

    export class VerifiedEmailStrategy extends PassportStrategy(Strategy, 'verified-email') {
        constructor() {
          super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
          });
        }
        
        async validate (user: UserInterface){
          if (!user.isVerified){
            throw new UnauthorizedException('Not allowed!!!');
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