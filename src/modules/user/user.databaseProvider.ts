import { DataSource } from 'typeorm';
import { DATA_SOURCE, USER_REPOSITORY } from 'src/core/constant/constants';
import { User } from 'src/modules/user/entities/user.entity';

export const userDataProviders = [
    {
        provide: USER_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE]

    },
];