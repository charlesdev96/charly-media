import { Controller } from "@nestjs/common";
import { ChatMicroserviceService } from "./chat.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { SendMessageDto } from "../../../../apps/lib/dtos/chats";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { Chat, User } from "../../../../apps/lib/entities";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";

@Controller()
export class ChatMicroserviceController {
  constructor(private readonly chatService: ChatMicroserviceService) {}

  @MessagePattern({ cmd: "sendMessage" })
  async sendMessage(
    @Payload()
    payload: {
      user: User;
      receiverId: string;
      sendMessageDto: SendMessageDto;
    },
  ): Promise<ResponseData> {
    const { user, receiverId, sendMessageDto } = payload;
    return this.chatService.sendMessage(user, receiverId, sendMessageDto);
  }

  @MessagePattern({ cmd: "chatHistory" })
  async chatHistoryWithUser(
    @Payload()
    payload: {
      user: User;
      receiverId: string;
      query: PaginatedQueryDto;
    },
  ): Promise<PaginatedResponseData<Chat>> {
    const { user, receiverId, query } = payload;
    return this.chatService.chatHistoryWithUser(user, receiverId, query);
  }

  @MessagePattern({ cmd: "deleteChat" })
  async deleteChat(
    @Payload()
    payload: {
      user: User;
      chatId: string;
    },
  ): Promise<ResponseData> {
    const { user, chatId } = payload;
    return this.chatService.deleteChat(user, chatId);
  }
}
