import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../../lib/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../../../lib/entities/post.entity";
import { PostControllerMicroservice } from "./post.controller";
import { PostsMicroserviceService } from "./posts.service";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostControllerMicroservice],
  providers: [PostsMicroserviceService],
})
export class PostModuleMicroservice {}
