import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import { DatabaseModule } from "../../../lib/database/database.module";
import { UserMicroserviceService } from "./user.service";
import { UserMicroserviceController } from "./user.controller";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  controllers: [UserMicroserviceController],
  providers: [UserMicroserviceService],
  exports: [],
})
export class UserModule {}
