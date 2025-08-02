import { Module } from "@nestjs/common";
import { LikeService } from "./like.service";
import { NatsClientModule } from "apps/lib/Nats-Client/nats-client.module";
import { AuthModule } from "../auth/auth.module";
import { LikeController } from "./like.controller";

@Module({
  imports: [NatsClientModule, AuthModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
