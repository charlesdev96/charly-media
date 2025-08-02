import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "apps/lib/database/database.module";
import { Chat, User } from "../../../../apps/lib/entities";
import { ChatMicroserviceService } from "./chat.service";
import { ChatMicroserviceController } from "./chat.controller";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Chat, User])],
  controllers: [ChatMicroserviceController],
  providers: [ChatMicroserviceService],
})
export class SingleChatMicroserviceModule {}
