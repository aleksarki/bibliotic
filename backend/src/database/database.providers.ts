import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export const databaseProviders = [
    {
        provide: "DATA_SOURCE",  // MAGIC
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: "postgres",
                host: configService.get<string>("DB_HOST"),
                port: configService.get<number>("DB_PORT"),
                username: configService.get<string>("DB_USERNAME"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_DATABASE"),
                synchronize: true,  // not in prod
                entities: [__dirname + "/../**/*.entity{.ts,.js}"]
            });
            return dataSource.initialize();
        }
    }
];
