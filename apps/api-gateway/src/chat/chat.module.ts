import { Module } from "@nestjs/common";
import { SingleChatModule } from "./singleChat/single-chat.module";
import { GroupChatModule } from "./groupChat/group-chat.module";

@Module({
  imports: [SingleChatModule, GroupChatModule],
})
export class ChatModule {}
