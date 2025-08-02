import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GroupChatService } from "./group-chat.service";
import { User } from "../../../../../apps/lib/entities";
import {
  CreateGroupDto,
  GroupMessageDto,
} from "../../../../../apps/lib/dtos/chats";
import { PaginatedQueryDto } from "../../../../../apps/lib/dtos/paginated-query.dto";
import { JwtAuthGuard } from "../../auth/guards";
import { currentUser } from "../../auth/decorators/currentUser.decorator";

@UseGuards(JwtAuthGuard)
@Controller("group")
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("create-group")
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @currentUser() user: User,
  ) {
    return this.groupChatService.createGroup(user, createGroupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get("recent-chat")
  async recentHistory(@currentUser() user: User) {
    return this.groupChatService.recentChatHistory(user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("join-group/:groupId")
  async joinGroup(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @currentUser() user: User,
  ) {
    return this.groupChatService.joinGroup(user, groupId);
  }

  @HttpCode(HttpStatus.OK)
  @Post("group-members/:groupId")
  async groupMembers(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @currentUser() user: User,
  ) {
    return this.groupChatService.groupMembers(user, groupId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("send-message/:groupId")
  async sendGroupMessage(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() groupMessageDto: GroupMessageDto,
    @currentUser() user: User,
  ) {
    return this.groupChatService.sendGroupMessage(
      user,
      groupId,
      groupMessageDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get("chat-history/:groupId")
  async groupChatsHistory(
    @Query() query: PaginatedQueryDto,
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @currentUser() user: User,
  ) {
    return this.groupChatService.groupChatsHistory(user, groupId, query);
  }
}
