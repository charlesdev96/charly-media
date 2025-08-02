import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { nats } from "../../../lib/constants/nats-clients.constant";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "../../../lib/entities/create-user.entity";
import { CreatePostDto, UpdatePostDto } from "../../../lib/dtos/posts/post.dto";
import { firstValueFrom } from "rxjs";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";
import { SearchPostsDto } from "../../../../apps/lib/dtos/posts/search-post.dto";
import { PostGateway } from "../socket.io/notifications/post.socket.service";

@Injectable()
export class PostService implements OnApplicationBootstrap {
  constructor(
    @Inject(nats) private readonly natsClient: ClientProxy,
    private readonly postGateway: PostGateway,
  ) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("Post microservice connected");
  }

  async createPost(user: User, createPostDto: CreatePostDto) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "create-post" },
        { user: user, createPostDto: createPostDto },
      ),
    );
    //Notify other users about the new post
    const message = {
      message: `${user.name} created a new post`,
      postId: response.data.postId,
      content: createPostDto.content,
      title: createPostDto.title,
      createdAt: new Date(),
    };
    this.postGateway.handleCreatePost(message, user.userId);
    return response;
  }
  async singlePost(postId: string) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "single-post" }, postId),
    );
    return response;
  }
  async allPosts(query: PaginatedQueryDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "all-posts" }, query),
    );
    return response;
  }

  async searchPosts(query: SearchPostsDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "search-posts" }, query),
    );
    return response;
  }
  async updatePost(user: User, updatePostDto: UpdatePostDto, postId: string) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "update-post" },
        { user: user, updatePostDto: updatePostDto, postId: postId },
      ),
    );
    return response;
  }

  async deletePost(user: User, postId: string) {
    const response = await firstValueFrom(
      this.natsClient.send(
        { cmd: "delete-post" },
        { user: user, postId: postId },
      ),
    );
    return response;
  }
}
