import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { PresenceService } from "./status.socket.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class LikePostGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly presenceService: PresenceService) {}
  handleLikePost(message: any, postId: string) {
    console.log("Liking post...", postId);

    const onlineUserIds = this.presenceService.getOnlineUserIds();

    onlineUserIds.forEach((userId) => {
      const socketId = this.presenceService.getSocketIdByUserId(userId);
      if (socketId) {
        this.server.to(socketId).emit("postLiked", message);
      }
    });
  }
}
