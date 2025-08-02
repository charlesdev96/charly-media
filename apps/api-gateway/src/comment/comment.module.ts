import { Module } from "@nestjs/common";
import { NatsClientModule } from "../../../../apps/lib/Nats-Client/nats-client.module";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [NatsClientModule, AuthModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
