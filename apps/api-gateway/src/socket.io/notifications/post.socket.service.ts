// post.gateway.ts
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "./status.socket.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class PostGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly presenceService: PresenceService) {}
  handleCreatePost(message: any, posterId: string) {
    console.log("Creating post...", posterId);

    const onlineUserIds = this.presenceService.getOnlineUserIds();

    onlineUserIds.forEach((userId) => {
      if (userId !== posterId) {
        const socketId = this.presenceService.getSocketIdByUserId(userId);
        if (socketId) {
          this.server.to(socketId).emit("postCreated", message);
        }
      }
    });
  }
}
