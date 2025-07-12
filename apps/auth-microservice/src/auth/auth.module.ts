import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/create-user.entity";
import { AuthMicroserviceController } from "./auth.controller";
import { AuthMicroserviceService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService],
  exports: [],
})
export class AuthModule {}
