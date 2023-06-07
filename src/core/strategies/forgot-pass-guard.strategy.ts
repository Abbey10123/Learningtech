import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import * as dotenv from "dotenv";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/user/entities/user.entity";

dotenv.config();

@Injectable()
export class ForgotPassGuardStrategy extends PassportStrategy(Strategy,'forgot-pass-guard'){
        constructor(){
            super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
            });
        }
        async validate (user: User){
        return {
            
            email: user.email, 
    
        }
    }  

    }