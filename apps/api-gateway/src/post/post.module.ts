import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { NatsClientModule } from "../../../lib/Nats-Client/nats-client.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [NatsClientModule, AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
