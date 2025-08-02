import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { PostModuleMicroservice } from "./posts/posts.module";
import { CommentMicroserviceModule } from "./comments/comment.module";
import { LikeMicroserviceModule } from "./likes/like.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostModuleMicroservice,
    CommentMicroserviceModule,
    LikeMicroserviceModule,
  ],
  controllers: [],
  providers: [],
})
export class PostMicroserviceModule {}
