import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment, Post, User } from "../../../../apps/lib/entities";
import { Repository } from "typeorm";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";
import { UserRole } from "../../../../apps/lib/enum/user.enum";
import { AddCommentDto } from "../../../../apps/lib/dtos/comments/add-comment.dto";

Injectable();
export class CommentMicroserviceService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async addComments(
    user: User,
    postId: string,
    addCommentDto: AddCommentDto,
  ): Promise<ResponseData> {
    //check if post exists
    const post = await this.postExists(postId);
    if (!post) {
      return {
        success: false,
        message: `Post with ID: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    const newComment = this.commentRepository.create({
      ...addCommentDto,
      userId: user.userId,
      postId: postId,
    });
    await this.commentRepository.save(newComment);
    return {
      success: true,
      message: "Comment successfully added",
      data: newComment,
    };
  }

  async postComments(
    postId: string,
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<Comment> | ResponseData> {
    //check if post exists
    const post = await this.postExists(postId);
    if (!post) {
      return {
        success: false,
        message: `Post with ID: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.commentRepository
      .createQueryBuilder("comment")
      .leftJoin("comment.user", "user")
      .select([
        "comment.commentId",
        "comment.comment",
        "comment.createdAt",
        "user.userId",
        "user.name",
        "user.email",
      ])
      .where("comment.postId = :postId", { postId: postId })
      .orderBy("comment.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const responseResult: PaginatedResponseData<Comment> = {
      success: true,
      message: "All comments for the post successfully fetched",
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

  async updateComment(
    commentId: string,
    updateCommentData: AddCommentDto,
    user: User,
  ): Promise<ResponseData> {
    const findCommentToUpdate = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });
    if (!findCommentToUpdate) {
      return {
        success: false,
        message: `Comment with ID: ${commentId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    // Ownership check (example, adjust as needed)
    const isOwner = await this.commentOwner(user, commentId);
    if (!isOwner) {
      return {
        success: false,
        message: "You are not authorized to update this comment",
        error: "Unauthorized",
        statusCode: 401,
      };
    }
    await this.commentRepository.update(
      { commentId: commentId },
      { comment: updateCommentData.comment },
    );
    const updatedComment = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });
    return {
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    };
  }

  async deleteComment(commentId: string, user: User): Promise<ResponseData> {
    const commentToDelete = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });
    if (!commentToDelete) {
      return {
        success: false,
        message: `Comment with ID: ${commentId} not found`,
        statusCode: 404,
        error: "NotFound",
      };
    }
    // Ownership check (example, adjust as needed)
    const isOwner = await this.commentOwner(user, commentId);
    if (!isOwner) {
      return {
        success: false,
        message: "You are not authorized to delete this comment",
        statusCode: 401,
        error: "Unauthorized",
      };
    }
    await this.commentRepository.remove(commentToDelete);
    return {
      success: true,
      message: "Comment successfully deleted",
    };
  }

  private async commentOwner(user: User, commentId: string): Promise<boolean> {
    const comment = await this.commentRepository.findOne({
      where: { commentId: commentId },
    });
    if (!comment) {
      return false;
    } else {
      if (comment.userId !== user.userId && user.role !== UserRole.Admin) {
        return false;
      } else {
        return true;
      }
    }
  }

  private async postExists(postId: string): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (post) {
      return true;
    } else {
      return false;
    }
  }
}
