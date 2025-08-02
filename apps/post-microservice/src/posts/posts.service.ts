import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../../../lib/entities/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto, UpdatePostDto } from "../../../lib/dtos/posts/post.dto";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import { UserRole } from "../../../lib/enum/user.enum";
import { User } from "../../../lib/entities/create-user.entity";
import { SearchPostsDto } from "../../../../apps/lib/dtos/posts/search-post.dto";

@Injectable()
export class PostsMicroserviceService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<ResponseData> {
    const newPost = this.postRepository.create({
      ...createPostDto,
      userId: user.userId,
    });
    await this.postRepository.save(newPost);
    return {
      success: true,
      message: "Post created successfully",
      data: newPost,
    };
  }

  async searchPosts(
    query: SearchPostsDto,
  ): Promise<PaginatedResponseData<Post>> {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder("post")
      .leftJoin("post.user", "user")
      .orderBy("post.createdAt", "DESC")
      .addSelect(["user.name", "user.email"])
      .where("post.title ILIKE :search", { search: `%${search}%` }) // partial match
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const responseResult: PaginatedResponseData<Post> = {
      success: true,
      message: "All searched posts successfully fetched",
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
      data: items,
    };
    return responseResult;
  }

  async getSinglePost(postId: string): Promise<ResponseData> {
    const post = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .select([
        "post", // selects all post fields
        "user.userId",
        "user.name",
      ])
      .where("post.postId = :postId", { postId })
      .getOne();

    if (!post) {
      return {
        success: false,
        message: `Post with id: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
        data: null,
      };
    }
    return {
      success: true,
      message: "Post successfully retrieved",
      data: post,
    };
  }

  async findAllPosts(
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<Post>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder("post")
      .leftJoin("post.user", "user")
      .orderBy("post.createdAt", "DESC")
      .addSelect(["user.name", "user.email"])
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const responseResult: PaginatedResponseData<Post> = {
      success: true,
      message: "All posts successfully fetched",
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
      data: items,
    };
    return responseResult;
  }

  async updatePosts(
    postId: string,
    updatePostData: UpdatePostDto,
    user: User,
  ): Promise<ResponseData> {
    const findPostToUpdate = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!findPostToUpdate) {
      return {
        success: false,
        message: `Post with ID: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    // Ownership check (example, adjust as needed)
    const isOwner = await this.postOwner(user, postId);
    if (!isOwner) {
      return {
        success: false,
        message: "You are not authorized to update this post",
        error: "Unauthorized",
        statusCode: 401,
      };
    }
    await this.postRepository.update(
      { postId: postId },
      {
        title: updatePostData.title,
        content: updatePostData.content,
      },
    );
    const updatedPost = await this.postRepository.save(findPostToUpdate);
    return {
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    };
  }

  async deletePost(postId: string, user: User): Promise<ResponseData> {
    const postToDelete = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!postToDelete) {
      return {
        success: false,
        message: `Post with ID: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    // Ownership check (example, adjust as needed)
    const isOwner = await this.postOwner(user, postId);
    if (!isOwner) {
      return {
        success: false,
        message: "You are not authorized to delete this post",
        statusCode: 401,
        error: "Unauthorized",
      };
    }
    await this.postRepository.remove(postToDelete);
    return {
      success: true,
      message: "Post successfully deleted",
    };
  }

  private async postOwner(user: User, postId: string): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!post) {
      return false;
    } else {
      if (post.userId !== user.userId && user.role !== UserRole.Admin) {
        return false;
      } else {
        return true;
      }
    }
  }
}
