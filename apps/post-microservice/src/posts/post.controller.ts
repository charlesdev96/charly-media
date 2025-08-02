import { Controller } from "@nestjs/common";
import { PostsMicroserviceService } from "./posts.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreatePostDto, UpdatePostDto } from "../../../lib/dtos/posts/post.dto";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import { Post } from "../../../lib/entities/post.entity";
import { User } from "../../../lib/entities/create-user.entity";
import { SearchPostsDto } from "../../../../apps/lib/dtos/posts/search-post.dto";

@Controller()
export class PostControllerMicroservice {
  constructor(private postService: PostsMicroserviceService) {}

  @MessagePattern({ cmd: "create-post" })
  async createPost(
    @Payload() payload: { user: User; createPostDto: CreatePostDto },
  ): Promise<ResponseData> {
    console.log("create post called");
    const { user, createPostDto } = payload;
    return this.postService.createPost(createPostDto, user);
  }

  @MessagePattern({ cmd: "single-post" })
  async singlePost(@Payload() postId: string): Promise<ResponseData> {
    return this.postService.getSinglePost(postId);
  }

  @MessagePattern({ cmd: "all-posts" })
  async getAllPosts(
    @Payload() query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<Post>> {
    return this.postService.findAllPosts(query);
  }

  @MessagePattern({ cmd: "search-posts" })
  async searchPosts(
    @Payload() query: SearchPostsDto,
  ): Promise<PaginatedResponseData<Post>> {
    return this.postService.searchPosts(query);
  }

  @MessagePattern({ cmd: "update-post" })
  async updatePost(
    @Payload()
    payload: {
      user: User;
      updatePostDto: UpdatePostDto;
      postId: string;
    },
  ): Promise<ResponseData> {
    const { user, updatePostDto, postId } = payload;
    return this.postService.updatePosts(postId, updatePostDto, user);
  }

  @MessagePattern({ cmd: "delete-post" })
  async deletePost(
    @Payload()
    payload: {
      user: User;
      postId: string;
    },
  ): Promise<ResponseData> {
    const { user, postId } = payload;
    return this.postService.deletePost(postId, user);
  }
}
