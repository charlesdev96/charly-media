import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RolesGuards } from "./guards";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../auth-microservice/src/auth/entity/create-user.entity";
import { NatsClientModule } from "../../../lib/Nats-Client/nats-client.module";

@Module({
  imports: [
    NatsClientModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuards],
  exports: [AuthService, RolesGuards],
})
export class AuthModule {}
