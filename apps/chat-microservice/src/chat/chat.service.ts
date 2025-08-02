import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat, User } from "../../../../apps/lib/entities";
import { SendMessageDto } from "../../../../apps/lib/dtos/chats";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";

@Injectable()
export class ChatMicroserviceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async sendMessage(
    user: User,
    receiverId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<ResponseData> {
    const receiver = await this.userRepository.findOne({
      where: { userId: receiverId },
    });
    if (!receiver) {
      return { success: false, message: "Receiver not found", statusCode: 404 };
    }
    const chat = this.chatRepository.create({
      senderId: user.userId,
      receiverId: receiver.userId,
      ...sendMessageDto,
    });
    await this.chatRepository.save(chat);
    const response = {
      chatId: chat.chatId,
      message: chat.message,
      receiver: {
        userId: receiver.userId,
        name: receiver.name,
      },
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
    return {
      success: true,
      message: "Message sent successfully",
      data: response,
    };
  }

  async chatHistoryWithUser(
    user: User,
    receiverId: string,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<Chat>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatRepository
      .createQueryBuilder("chat")
      .where(
        `(chat.senderId = :userId AND chat.receiverId = :receiverId)
     OR (chat.senderId = :receiverId AND chat.receiverId = :userId)`,
        {
          userId: user.userId,
          receiverId,
        },
      )
      .select([
        "chat.message",
        "chat.senderId",
        "chat.receiverId",
        "chat.createdAt",
        "chat.updatedAt",
      ])
      .orderBy("chat.createdAt", "ASC")
      .skip(skip)
      .take(limit);
    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    const response: PaginatedResponseData<Chat> = {
      success: true,
      message: "Chat history retrieved successfully",
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
      data: items,
    };
    return response;
  }

  async deleteChat(user: User, chatId: string): Promise<ResponseData> {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (!chat) {
      return {
        success: false,
        message: `Chat with Id: ${chatId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    const isOwner = await this.isChatOwner(user, chatId);
    if (!isOwner) {
      return {
        success: false,
        message: `You are not authorized to delete this chat`,
        statusCode: 403,
        error: "Unathourized",
      };
    }
    await this.chatRepository.remove(chat);
    return {
      success: true,
      message: `Chat with Id: ${chatId} deleted successfully`,
      data: {
        chatId: chatId,
        receiverId: chat.receiverId,
      },
    };
  }

  private async isChatOwner(user: User, chatId: string): Promise<boolean> {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (!chat) {
      return false;
    } else {
      //check if chat belongs to user
      if (chat.senderId === user.userId) {
        return true;
      } else {
        return false;
      }
    }
  }
}
