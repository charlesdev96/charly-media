import { Module } from "@nestjs/common";
import { NatsClientModule } from "apps/lib/Nats-Client/nats-client.module";
import { AuthModule } from "../../auth/auth.module";
import { GroupChatController } from "./group-chat.controller";
import { GroupChatService } from "./group-chat.service";

@Module({
  imports: [NatsClientModule, AuthModule],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
