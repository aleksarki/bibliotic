import { DataSource } from "typeorm";
import { User } from "./user.entity";

export const userProviders = [
    {
        provide: "USER_REPOSITORY",  // MAGIC
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ["DATA_SOURCE"]
    }
];
