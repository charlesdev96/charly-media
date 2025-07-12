import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config/dist/config.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class PostMicroserviceModule {}
