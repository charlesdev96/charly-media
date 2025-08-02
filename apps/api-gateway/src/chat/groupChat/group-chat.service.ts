import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { nats } from "../../../../../apps/lib/constants/nats-clients.constant";
import { ChatGateway } from "../../socket.io/notifications";
import { User } from "../../../../../apps/lib/entities";
import {
  CreateGroupDto,
  GroupMessageDto,
} from "../../../../../apps/lib/dtos/chats";
import { firstValueFrom } from "rxjs";
import { PaginatedQueryDto } from "../../../../../apps/lib/dtos/paginated-query.dto";

@Injectable()
export class GroupChatService implements OnApplicationBootstrap {
  constructor(
    @Inject(nats) private readonly natsClient: ClientProxy,
    private chatGateway: ChatGateway,
  ) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("Group chat microservice connected");
  }

  async createGroup(user: User, createGroupDto: CreateGroupDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "createGroup" }, { user, createGroupDto }),
    );
    if (response.success) {
      const message = {
        groupId: response.data.groupId,
        message: `Checkout the new group created by ${user.name}`,
        groupName: response.data.groupName,
      };
      await this.chatGateway.notifyAllOnlineUsersOfNewGroup(
        message,
        user,
        response.data.groupId as string,
      );
    }
    return response;
  }

  async joinGroup(user: User, groupId: string) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "joinGroup" }, { user, groupId }),
    );
    if (response.success) {
      await this.chatGateway.notifyGroupMembersUserJoined(groupId, user);
    }
    return response;
  }

  async groupMembers(user: User, groupId: string) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "groupMember" }, { user, groupId }),
    );
    return response;
  }

  async sendGroupMessage(
    user: User,
    groupId: string,
    groupMessageDto: GroupMessageDto,
  ) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "sendGroupMessage" },
        { user, groupId, groupMessageDto },
      ),
    );
    if (response.success) {
      const message = {
        groupId: groupId,
        message: response.data.message || "",
        sentAt: new Date(),
        sentBy: {
          userId: user.userId,
          name: user.name,
        },
      };
      this.chatGateway.sendGroupMessage(groupId, message);
    }
    return response;
  }

  async groupChatsHistory(
    user: User,
    groupId: string,
    query: PaginatedQueryDto,
  ) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "groupChatHistory" },
        { user, groupId, query },
      ),
    );
    return response;
  }

  async recentChatHistory(user: User) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "recentChat" }, { user }),
    );
    return response;
  }
}
