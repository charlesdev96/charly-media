import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../../lib/database/database.module";
import { UserMicroserviceService } from "./user.service";
import { UserMicroserviceController } from "./user.controller";
import { User } from "../../../lib/entities/create-user.entity";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  controllers: [UserMicroserviceController],
  providers: [UserMicroserviceService],
  exports: [],
})
export class UserModule {}
