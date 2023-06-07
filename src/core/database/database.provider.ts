import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../constant/constants';
import { User } from 'src/modules/user/entities/user.entity';

export const databaseProvider = [
    {
        provide : DATA_SOURCE,
        useFactory: async () => {
        const dataSource = new DataSource({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'talentdev_2',
            entities: [User],
            synchronize: true
        });

        return dataSource.initialize();
    },

    },
];