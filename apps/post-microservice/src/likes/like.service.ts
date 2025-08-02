import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, User } from "../../../../apps/lib/entities";
import { Repository } from "typeorm";
import { ResponseData } from "../../../../apps/lib/interface/response.interface";

@Injectable()
export class LikeMicroserviceService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async likePost(postId: string, user: User): Promise<ResponseData> {
    //find the post
    const post = await this.postRepository.findOne({
      where: { postId: postId },
    });
    if (!post) {
      return {
        success: false,
        message: `Post with id: ${postId} not found`,
        statusCode: 404,
        error: "NotFound",
        data: null,
      };
    }
    let action = "liked";
    //check if user has already liked the post before
    const hasLiked = post.likes.some(
      (like) => like.userId.toString() === user.userId.toString(),
    );
    if (hasLiked) {
      //if the user has already liked the post, remove userId from likes array and reduce numOfLikes
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== user.userId.toString(),
      );
      action = "unliked";
    } else {
      //if the user has not liked the post, add userId to likes array and increase numOfLikes
      post.likes.push({ userId: user.userId, likedAt: new Date() });
      action = "liked";
    }
    post.numOfLikes = post.likes.length;
    await this.postRepository.save(post);
    const updatedPost = await this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .select([
        "post.postId",
        "post.content",
        "post.numOfLikes",
        "user.userId",
        "user.name",
      ])
      .where("post.postId = :postId", { postId })
      .getOne();

    return {
      success: true,
      message: `Post ${action} successfully`,
      data: updatedPost,
    };
  }
}
