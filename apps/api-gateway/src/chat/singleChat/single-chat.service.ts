import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { nats } from "../../../../../apps/lib/constants/nats-clients.constant";
import { User } from "../../../../../apps/lib/entities";
import { SendMessageDto } from "../../../../../apps/lib/dtos/chats";
import { firstValueFrom } from "rxjs";
import { PaginatedQueryDto } from "../../../../../apps/lib/dtos/paginated-query.dto";
import { ChatGateway } from "../../socket.io/notifications";

@Injectable()
export class SingleChatService implements OnApplicationBootstrap {
  constructor(
    @Inject(nats) private readonly natsClient: ClientProxy,
    private chatGateway: ChatGateway,
  ) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("Single chat microservice connected");
  }

  async sendMessage(
    user: User,
    receiverId: string,
    sendMessageDto: SendMessageDto,
  ) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "sendMessage" },
        { user: user, receiverId: receiverId, sendMessageDto: sendMessageDto },
      ),
    );
    const receiverMessage = {
      message: `${response.data.receiver.name} has sent you a message`,
      chat: response.data.message,
    };
    const generalMessage = {
      message: `${user.name} ↔ ${response.data.receiver.name}: New conversation update`,
      chat: response.data.message,
      createdAt: response.data.createdAt,
      senderId: user.userId,
      receiverId: receiverId,
      chatId: response.data.chatId,
    };
    this.chatGateway.receiverNotification(receiverId, receiverMessage);
    this.chatGateway.sendRealTimeMessage(
      receiverId,
      user.userId,
      generalMessage,
    );
    return response;
  }

  async chatHistoryWithUser(
    user: User,
    receiverId: string,
    query: PaginatedQueryDto,
  ) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "chatHistory" }, { user, receiverId, query }),
    );
    return response;
  }

  async deleteChat(user: User, chatId: string) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "deleteChat" }, { user, chatId }),
    );

    // ✅ Only proceed if deletion was successful and receiverId exists
    if (response.success && response.data?.receiverId) {
      const message = {
        message: `${user.name} has deleted a chat with you`,
        chatId: chatId,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.chatGateway.deleteMessage(response.data.receiverId, message);
    }
    return response;
  }
}
