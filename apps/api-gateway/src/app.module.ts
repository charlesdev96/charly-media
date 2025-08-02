import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../../lib/database/database.module";
import { minutes, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { SocketGatewayModule } from "./socket.io/socket.gateway.module";
import { LikeModule } from "./Like/like.module";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { ttl: minutes(1), blockDuration: minutes(5), limit: 10 },
    ]),
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,
    ChatModule,
    SocketGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
