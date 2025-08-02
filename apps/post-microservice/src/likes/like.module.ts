import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../../../apps/lib/database/database.module";
import { Post } from "../../../../apps/lib/entities";
import { LikeMicroserviceService } from "./like.service";
import { LikeMicroserviceController } from "./like.controller";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Post])],
  controllers: [LikeMicroserviceController],
  providers: [LikeMicroserviceService],
})
export class LikeMicroserviceModule {}
