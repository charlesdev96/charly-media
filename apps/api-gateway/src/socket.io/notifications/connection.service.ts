import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { PresenceService } from "./status.socket.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMember, User } from "../../../../../apps/lib/entities";
import { Repository } from "typeorm";

@Injectable()
@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    private readonly presenceService: PresenceService,
  ) {}
  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      console.warn("No authorization header provided");
      client.disconnect();
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.warn("No token provided");
      client.disconnect();
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
        userId: string;
      };
      if (!decoded.userId) {
        throw new Error("Invalid token payload");
      }
      const userId = decoded.userId;
      const user = await this.userRepository.findOne({
        where: { userId: userId },
      });
      if (!user) {
        console.warn("User not found");
        client.disconnect();
        return;
      }

      this.presenceService.setUserOnline(userId, client.id);
      //connect users to the groups they joined
      void this.autoJoinUserGroups(userId, client);
      console.log("User connected....", client.id);

      client.broadcast.emit("user-status-changed", {
        userId,
        name: user.name,
        socketId: client.id,
        isOnline: true,
        lastSeen: new Date().toISOString(), // Better to use ISO string
      });
    } catch (err) {
      // 5. Secure error handling
      console.warn("Connection failed:", err.name);
      if (err.name === "JsonWebTokenError") {
        console.warn("Invalid token format");
      } else if (err.name === "TokenExpiredError") {
        console.warn("Token expired");
      }
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.presenceService.getUserIdBySocketId(client.id);
    if (userId) {
      this.presenceService.removeUser(userId);
      client.broadcast.emit("user-status-changed", {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    }
  }

  private async getUserGroupIds(userId: string): Promise<string[]> {
    //get the Ids of the group the user belongs to
    const groupIds: string[] = [];
    const groups = await this.groupMemberRepository.find({
      where: { memberId: userId },
    });
    if (groups.length > 0) {
      for (const group of groups) {
        groupIds.push(group.groupId);
      }
    }
    return groupIds;
  }

  // Auto-join groups user belongs to
  // private async autoJoinUserGroups(userId: string, socket: Socket) {
  //   const groupIds: string[] = await this.getUserGroupIds(userId);
  //   for (const groupId of groupIds) {
  //     await socket.join(groupId);
  //   }
  // }

  private async autoJoinUserGroups(userId: string, socket: Socket) {
    const groupIds = await this.getUserGroupIds(userId);
    await Promise.all(
      groupIds.map(async (groupId) => {
        await socket.join(groupId);
        this.presenceService.addUserToGroup(groupId, userId);
      }),
    );
  }
}
