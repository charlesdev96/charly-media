import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { nats } from "../../../../apps/lib/constants/nats-clients.constant";
import { firstValueFrom } from "rxjs";
import { User } from "../../../../apps/lib/entities";
import { AddCommentDto } from "../../../../apps/lib/dtos/comments/add-comment.dto";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";
import { CommentGateway } from "../socket.io/notifications/comment.socket.service";

@Injectable()
export class CommentService implements OnApplicationBootstrap {
  constructor(
    @Inject(nats) private readonly natsClient: ClientProxy,
    private readonly commentGateway: CommentGateway,
  ) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("Comment microservice connected");
  }

  async addComment(user: User, addCommentDto: AddCommentDto, postId: string) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "add-comment" },
        { user: user, addCommentDto: addCommentDto, postId: postId },
      ),
    );
    const message = {
      message: `${user.name} commented on a post`,
      commentId: response.data.commentId,
      comment: addCommentDto.comment,
      postId: postId,
      user: {
        userId: user.userId,
        name: user.name,
      },
      createdAt: new Date(),
    };
    this.commentGateway.handleCreateComment(message, user.userId);
    return response;
  }

  async postComment(postId: string, query: PaginatedQueryDto) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "post-comments" },
        { postId: postId, query: query },
      ),
    );
    return response;
  }

  async updateComment(
    user: User,
    addCommentDto: AddCommentDto,
    commentId: string,
  ) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "update-comment" },
        { commentId: commentId, addCommentDto: addCommentDto, user: user },
      ),
    );
    return response;
  }

  async deleteComment(user: User, commentId: string) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "delete-comment" },
        { commentId: commentId, user: user },
      ),
    );
    return response;
  }
}
