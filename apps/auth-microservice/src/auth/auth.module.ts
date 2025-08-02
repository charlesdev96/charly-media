import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthMicroserviceController } from "./auth.controller";
import { AuthMicroserviceService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { User } from "../../../lib/entities/create-user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService],
  exports: [],
})
export class AuthModule {}
