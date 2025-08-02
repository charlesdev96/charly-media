// post.gateway.ts
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "./status.socket.service";
import { User } from "apps/lib/entities";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly presenceService: PresenceService) {}
  sendRealTimeMessage(receiverId: string, senderId: string, message: any) {
    const receiverSocketId =
      this.presenceService.getSocketIdByUserId(receiverId);
    const senderSocketId = this.presenceService.getSocketIdByUserId(senderId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit("incoming-message", message);
    }
    if (senderSocketId) {
      this.server.to(senderSocketId).emit("incoming-message", message);
    }
    console.log(
      `Sending real-time message to receiver: ${receiverId} and sender: ${senderId}`,
    );
  }

  receiverNotification(receiverId: string, message: any) {
    const receiverSocketId =
      this.presenceService.getSocketIdByUserId(receiverId);
    if (receiverSocketId) {
      this.server
        .to(receiverSocketId)
        .emit("new-message-notification", message);
    }
    console.log(`New message notification to receiver: ${receiverId}`);
  }

  deleteMessage(receiverId: string, message: any) {
    const receiverSocketId =
      this.presenceService.getSocketIdByUserId(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit("delete-message", message);
    }

    console.log(`deleting real-time message to receiver: ${receiverId}`);
  }

  //notify all users when a group is created
  async notifyAllOnlineUsersOfNewGroup(
    message: any,
    user: User,
    groupId: string,
  ) {
    this.presenceService.addUserToGroup(groupId, user.userId);
    const socketId = this.presenceService.getSocketIdByUserId(user.userId);
    if (socketId) {
      await this.server.sockets.sockets.get(socketId)?.join(groupId);
    }
    this.server.emit("new-group-created", {
      message,
    });
    console.log("Notifying online users of new group created");
  }

  // Notify group members (who are online) when someone joins the group
  async notifyGroupMembersUserJoined(groupId: string, user: User) {
    this.presenceService.addUserToGroup(groupId, user.userId);
    const socketId = this.presenceService.getSocketIdByUserId(user.userId);
    if (socketId) {
      await this.server.sockets.sockets.get(socketId)?.join(groupId);
    }
    const groupMembers = this.presenceService.getGroupMembers(groupId);
    const onlineMembers = groupMembers.filter(
      (memberId) =>
        memberId !== user.userId && this.presenceService.isUserOnline(memberId),
    );

    onlineMembers.forEach((memberId) => {
      const memberSocketId = this.presenceService.getSocketIdByUserId(memberId);
      if (memberSocketId) {
        this.server.to(memberSocketId).emit("group-user-joined", {
          groupId,
          message: `${user.name} joined the group`,
          user: {
            userId: user.userId,
            name: user.name,
          },
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  async notifyGroupMembersUserLeft(groupId: string, user: User) {
    this.presenceService.removeUserFromGroup(groupId, user.userId);

    const socketId = this.presenceService.getSocketIdByUserId(user.userId);
    if (socketId) {
      await this.server.sockets.sockets.get(socketId)?.leave(groupId);
    }

    const groupMembers = this.presenceService.getGroupMembers(groupId);
    const onlineMembers = groupMembers.filter((memberId) =>
      this.presenceService.isUserOnline(memberId),
    );

    onlineMembers.forEach((memberId) => {
      const memberSocketId = this.presenceService.getSocketIdByUserId(memberId);
      if (memberSocketId) {
        this.server.to(memberSocketId).emit("group-user-left", {
          groupId,
          message: `${user.name} left the group`,
          user: {
            userId: user.userId,
            name: user.name,
          },
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  sendGroupMessage(groupId: string, message: any) {
    this.server.to(groupId).emit("group-message", message);
    console.log("sending message to group:", groupId);
  }
}
