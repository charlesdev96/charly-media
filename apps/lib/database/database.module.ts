import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../auth-microservice/src/auth/entity/create-user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DATABASE_HOST"),
        port: config.get<number>("DATABASE_PORT"),
        username: config.get<string>("DATABASE_USER"),
        password: config.get<string>("DATABASE_PASSWORD"),
        database: config.get<string>("DATABASE_NAME"),
        entities: [User], // add your entities here
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
