import { Controller } from "@nestjs/common";
import { CommentMicroserviceService } from "./comment.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { User } from "../../../../apps/lib/entities";
import { AddCommentDto } from "../../../../apps/lib/dtos/comments/add-comment.dto";
import {
  ResponseData,
  PaginatedResponseData,
} from "../../../../apps/lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";
import { Comment } from "../../../../apps/lib/entities/comment.entity";

@Controller()
export class CommentMicroserviceController {
  constructor(private commentService: CommentMicroserviceService) {}

  @MessagePattern({ cmd: "add-comment" })
  async addComments(
    @Payload()
    payload: {
      user: User;
      addCommentDto: AddCommentDto;
      postId: string;
    },
  ): Promise<ResponseData> {
    const { user, addCommentDto, postId } = payload;
    return await this.commentService.addComments(user, postId, addCommentDto);
  }

  @MessagePattern({ cmd: "post-comments" })
  async postComments(
    @Payload() payload: { postId: string; query: PaginatedQueryDto },
  ): Promise<PaginatedResponseData<Comment> | ResponseData> {
    const { postId, query } = payload;
    return await this.commentService.postComments(postId, query);
  }

  @MessagePattern({ cmd: "update-comment" })
  async updateComment(
    @Payload()
    payload: {
      user: User;
      addCommentDto: AddCommentDto;
      commentId: string;
    },
  ): Promise<ResponseData> {
    const { user, addCommentDto, commentId } = payload;
    return await this.commentService.updateComment(
      commentId,
      addCommentDto,
      user,
    );
  }

  @MessagePattern({ cmd: "delete-comment" })
  async deleteComment(
    @Payload()
    payload: {
      user: User;
      commentId: string;
    },
  ): Promise<ResponseData> {
    const { user, commentId } = payload;
    return await this.commentService.deleteComment(commentId, user);
  }
}
