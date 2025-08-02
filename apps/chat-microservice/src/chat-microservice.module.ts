import { Module } from "@nestjs/common";
import { SingleChatMicroserviceModule } from "./chat/chat.module";
import { GroupChatModule } from "./group-chat/group-chat.module";

@Module({
  imports: [SingleChatMicroserviceModule, GroupChatModule],
  controllers: [],
  providers: [],
})
export class ChatMicroserviceModule {}
