import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import { NatsClientModule } from "../../../lib/Nats-Client/nats-client.module";
import { AuthModule } from "../auth/auth.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [NatsClientModule, TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
