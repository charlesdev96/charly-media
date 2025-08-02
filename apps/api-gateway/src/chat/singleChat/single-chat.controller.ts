import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SingleChatService } from "./single-chat.service";
import { currentUser } from "../../auth/decorators/currentUser.decorator";
import { User } from "../../../../../apps/lib/entities";
import { SendMessageDto } from "../../../../../apps/lib/dtos/chats";
import { JwtAuthGuard } from "../../auth/guards";
import { PaginatedQueryDto } from "../../../../../apps/lib/dtos/paginated-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("chat")
export class SingleChatController {
  constructor(private readonly singleChatService: SingleChatService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("send-message/:receiverId")
  async sendMessage(
    @Param("receiverId", ParseUUIDPipe) receiverId: string,
    @currentUser() user: User,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.singleChatService.sendMessage(user, receiverId, sendMessageDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("get-messages/:receiverId")
  async getMessages(
    @Param("receiverId", ParseUUIDPipe) receiverId: string,
    @currentUser() user: User,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.singleChatService.chatHistoryWithUser(user, receiverId, query);
  }

  @HttpCode(HttpStatus.OK)
  @Post("delete-chat/:chatId")
  async deleteChat(
    @Param("chatId", ParseUUIDPipe) chatId: string,
    @currentUser() user: User,
  ) {
    return this.singleChatService.deleteChat(user, chatId);
  }
}
