import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards";
import { PostService } from "./post.service";
import { CreatePostDto, UpdatePostDto } from "../../../lib/dtos/posts/post.dto";
import { currentUser } from "../auth/decorators/currentUser.decorator";
import { User } from "../../../lib/entities/create-user.entity";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";
import { SearchPostsDto } from "../../../../apps/lib/dtos/posts/search-post.dto";

@UseGuards(JwtAuthGuard)
@Controller("post")
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("create-post")
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @currentUser() user: User,
  ) {
    return await this.postService.createPost(user, createPostDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get("all-posts")
  async getAllPosts(@Query() query: PaginatedQueryDto) {
    return await this.postService.allPosts(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get("search-posts")
  async searchPosts(@Query() query: SearchPostsDto) {
    return await this.postService.searchPosts(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":postId")
  async getSinglePost(@Param("postId", ParseUUIDPipe) postId: string) {
    return await this.postService.singlePost(postId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":postId")
  async updatePost(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @currentUser() user: User,
  ) {
    return await this.postService.updatePost(user, updatePostDto, postId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":postId")
  async deletePost(
    @Param("postId", ParseUUIDPipe) postId: string,
    @currentUser() user: User,
  ) {
    return await this.postService.deletePost(user, postId);
  }
}
