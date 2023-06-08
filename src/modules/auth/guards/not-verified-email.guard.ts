import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class NotVerifiedEmailGuard extends AuthGuard('not-verified-email') {}