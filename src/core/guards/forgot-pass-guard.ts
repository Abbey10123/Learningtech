import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ForgotPassGuard extends AuthGuard('forgot-pass-guard'){}