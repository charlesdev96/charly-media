import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module";
import { NatsClientModule } from "../../../../../apps/lib/Nats-Client/nats-client.module";
import { SingleChatService } from "./single-chat.service";
import { SingleChatController } from "./single-chat.controller";

@Module({
  imports: [NatsClientModule, AuthModule],
  controllers: [SingleChatController],
  providers: [SingleChatService],
})
export class SingleChatModule {}
