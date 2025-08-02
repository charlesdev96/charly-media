import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RolesGuards } from "./guards";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NatsClientModule } from "../../../lib/Nats-Client/nats-client.module";
import { User } from "../../../lib/entities/create-user.entity";

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
