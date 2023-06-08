import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class VerifiedEmailGuard extends AuthGuard('verified-email') {}