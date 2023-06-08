import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OtpReason } from "../Interface/otp.interface";

@Entity({name: 'otps'})
export class Otp implements Otp {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({name: 'user_id'})
    userId: number;
    @Column()
    code: string;
    @Column ({name: 'otp_reason', type:'enum', enum: OtpReason, default: OtpReason.verifyEmail, nullable:false})
    otpReason: OtpReason

    @Column()
    expiryDate: Date

}