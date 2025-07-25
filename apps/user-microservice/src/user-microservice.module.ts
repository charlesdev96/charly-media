import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class UserMicroserviceModule {}
