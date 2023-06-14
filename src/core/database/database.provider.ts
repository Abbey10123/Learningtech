import * as dotenv from 'dotenv';
import { Otp } from 'src/modules/user/entities/otp.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource } from "typeorm";
import { DATA_SOURCE } from '../constant/constants';
dotenv.config()

export const databaseProvider = [
   {
      provide: DATA_SOURCE,
      useFactory: async () => {
          const dataSource = new DataSource({
            type: 'mysql',
            host: 'db4free.net',
            port: 3306,
            username: 'quanta',
            password: 'talentdev2023' ,
            database: 'quantatalentdev',
            entities:[User,Otp],
            synchronize: true, 
          });
          return dataSource.initialize();
      },
  }
]
