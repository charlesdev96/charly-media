// post.gateway.ts
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "./status.socket.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class CommentGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly presenceService: PresenceService) {}
  handleCreateComment(message: any, commenterId: string) {
    console.log("Creating comment...", commenterId);

    const onlineUserIds = this.presenceService.getOnlineUserIds();

    onlineUserIds.forEach((userId) => {
      if (userId !== commenterId) {
        const socketId = this.presenceService.getSocketIdByUserId(userId);
        if (socketId) {
          this.server.to(socketId).emit("commentCreated", message);
        }
      }
    });
  }
}
