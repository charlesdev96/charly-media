import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NatsClientModule } from "../../../lib/Nats-Client/nats-client.module";
import { AuthModule } from "../auth/auth.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "../../../lib/entities/create-user.entity";

@Module({
  imports: [NatsClientModule, TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
