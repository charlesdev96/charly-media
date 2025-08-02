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
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "../auth/guards";
import { AddCommentDto } from "../../../../apps/lib/dtos/comments/add-comment.dto";
import { currentUser } from "../auth/decorators/currentUser.decorator";
import { User } from "../../../../apps/lib/entities";
import { PaginatedQueryDto } from "../../../../apps/lib/dtos/paginated-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("add-comment/:postId")
  async addComment(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() addCommentDto: AddCommentDto,
    @currentUser() user: User,
  ) {
    return await this.commentService.addComment(user, addCommentDto, postId);
  }

  @HttpCode(HttpStatus.OK)
  @Get("post-comments/:postId")
  async postComments(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return await this.commentService.postComment(postId, query);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("update-comment/:commentId")
  async updateComment(
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() addCommentDto: AddCommentDto,
    @currentUser() user: User,
  ) {
    return await this.commentService.updateComment(
      user,
      addCommentDto,
      commentId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete("delete-comment/:commentId")
  async deleteComment(
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @currentUser() user: User,
  ) {
    return await this.commentService.deleteComment(user, commentId);
  }
}
