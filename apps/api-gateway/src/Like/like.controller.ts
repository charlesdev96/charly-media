import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { LikeService } from "./like.service";
import { currentUser } from "../auth/decorators/currentUser.decorator";
import { User } from "../../../../apps/lib/entities";
import { JwtAuthGuard } from "../auth/guards";

@UseGuards(JwtAuthGuard)
@Controller("like")
export class LikeController {
  constructor(private likeService: LikeService) {}

  @HttpCode(HttpStatus.OK)
  @Get(":postId")
  async likePost(
    @Param("postId", ParseUUIDPipe) postId: string,
    @currentUser() user: User,
  ) {
    return await this.likeService.likePost(postId, user);
  }
}
