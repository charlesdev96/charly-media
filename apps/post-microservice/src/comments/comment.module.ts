import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../../../apps/lib/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment, Post } from "../../../../apps/lib/entities";
import { CommentMicroserviceService } from "./comment.service";
import { CommentMicroserviceController } from "./comment.controller";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Comment, Post])],
  providers: [CommentMicroserviceService],
  controllers: [CommentMicroserviceController],
})
export class CommentMicroserviceModule {}
