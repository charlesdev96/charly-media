import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "../../lib/database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthMicroserviceModule {}
