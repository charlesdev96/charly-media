import { Controller } from "@nestjs/common";
import { LikeMicroserviceService } from "./like.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ResponseData } from "../../../../apps/lib/interface/response.interface";
import { User } from "../../../../apps/lib/entities";

@Controller()
export class LikeMicroserviceController {
  constructor(private readonly likeService: LikeMicroserviceService) {}

  // Define your endpoints here
  @MessagePattern({ cmd: "likePost" })
  async likePost(
    @Payload() payload: { postId: string; user: User },
  ): Promise<ResponseData> {
    const { postId, user } = payload;
    return this.likeService.likePost(postId, user);
  }
}
