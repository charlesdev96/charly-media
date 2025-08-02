import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { nats } from "../../../../apps/lib/constants/nats-clients.constant";
import { User } from "../../../../apps/lib/entities";
import { firstValueFrom } from "rxjs";
import { LikePostGateway } from "../socket.io/notifications";

@Injectable()
export class LikeService {
  constructor(
    @Inject(nats) private readonly natsClient: ClientProxy,
    private readonly likeGateway: LikePostGateway,
  ) {}

  async likePost(postId: string, user: User) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "likePost" }, { postId: postId, user: user }),
    );
    const message = {
      message: response.message,
      postId: postId,
      numOfLikes: response.data.numOfLikes,
    };
    this.likeGateway.handleLikePost(message, postId);
    return response;
  }
}
