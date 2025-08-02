import { Global, Module } from "@nestjs/common";
import { DatabaseModule } from "../../../../apps/lib/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupMember, User } from "../../../../apps/lib/entities";
import {
  ChatGateway,
  CommentGateway,
  LikePostGateway,
  PostGateway,
  PresenceService,
  UserGateway,
} from "./notifications";

@Global()
@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, GroupMember])],
  providers: [
    PresenceService,
    UserGateway,
    PostGateway,
    CommentGateway,
    LikePostGateway,
    ChatGateway,
  ],
  exports: [
    UserGateway,
    PostGateway,
    CommentGateway,
    LikePostGateway,
    ChatGateway,
  ],
})
export class SocketGatewayModule {
  // This module is responsible for WebSocket gateway-related functionality
}
