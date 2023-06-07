import { Module } from '@nestjs/common';
import { userDataProviders } from './user.databaseProvider';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [...userDataProviders],
})
export class UserModule {}
