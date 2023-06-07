export interface Otp{
    id: number,
    userId: number,
    code: string,
    otpReason: OtpReason,
    expiryDate: Date
}

export enum OtpReason{
    verifyEmail = 'verify-email',
    resetPassword= 'reset-password',
}