import { User } from "./entities/user.entity";
import { OTP_REPOSITORY, USER_REPOSITORY } from "src/core/constant/constants"; 
import { DataSource } from 'typeorm';
import { Otp } from "./entities/otp.entity";

export const usersProvider = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['DATA_SOURCE'],
    }
]

export const otpsProvider= [
    {
        provide: OTP_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Otp),
        inject: ['DATA_SOURCE'],
    }
]