import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "apps/lib/database/database.module";
import {
  Chat,
  Group,
  GroupChat,
  GroupMember,
} from "../../../../apps/lib/entities";
import { GroupChatMicroserviceService } from "./group-chat.service";
import { GroupChatMicroserviceController } from "./group-chat.controller";

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Group, GroupChat, GroupMember, Chat]),
  ],
  controllers: [GroupChatMicroserviceController],
  providers: [GroupChatMicroserviceService],
})
export class GroupChatModule {}
