import { Controller } from "@nestjs/common";
import { GroupChatMicroserviceService } from "./group-chat.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GroupChat, User } from "../../../../apps/lib/entities";
import {
  CreateGroupDto,
  GroupMessageDto,
} from "../../../../apps/lib/dtos/chats";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";

@Controller()
export class GroupChatMicroserviceController {
  constructor(
    private readonly groupChatService: GroupChatMicroserviceService,
  ) {}

  @MessagePattern({ cmd: "createGroup" })
  async createGroup(
    @Payload() payload: { user: User; createGroupDto: CreateGroupDto },
  ): Promise<ResponseData> {
    const { user, createGroupDto } = payload;
    return this.groupChatService.createGroup(user, createGroupDto);
  }

  @MessagePattern({ cmd: "joinGroup" })
  async joinGroup(
    @Payload() payload: { user: User; groupId: string },
  ): Promise<ResponseData> {
    const { groupId, user } = payload;
    return this.groupChatService.joinGroup(user, groupId);
  }

  @MessagePattern({ cmd: "groupMember" })
  async groupMembers(
    @Payload() payload: { user: User; groupId: string },
  ): Promise<ResponseData> {
    const { groupId, user } = payload;
    return this.groupChatService.groupMembers(groupId, user);
  }

  @MessagePattern({ cmd: "sendGroupMessage" })
  async sendGroupMessage(
    @Payload()
    payload: {
      user: User;
      groupId: string;
      groupMessageDto: GroupMessageDto;
    },
  ): Promise<ResponseData> {
    const { groupId, user, groupMessageDto } = payload;
    return this.groupChatService.sendGroupMessage(
      user,
      groupId,
      groupMessageDto,
    );
  }

  @MessagePattern({ cmd: "groupChatHistory" })
  async groupChatsHistory(
    @Payload()
    payload: {
      user: User;
      groupId: string;
      query: PaginatedQueryDto;
    },
  ): Promise<PaginatedResponseData<GroupChat> | ResponseData> {
    const { groupId, user, query } = payload;
    return this.groupChatService.groupChatsHistory(user, groupId, query);
  }

  @MessagePattern({ cmd: "recentChat" })
  async recentChatHistory(
    @Payload() payload: { user: User },
  ): Promise<ResponseData> {
    const { user } = payload;
    return this.groupChatService.getRecentChats(user);
  }
}
