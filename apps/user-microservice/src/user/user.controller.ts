import { Controller } from "@nestjs/common";
import { UserMicroserviceService } from "./user.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";

@Controller()
export class UserMicroserviceController {
  constructor(private userService: UserMicroserviceService) {}

  @MessagePattern({ cmd: "profile" })
  async profile(@Payload() user: User): Promise<ResponseData> {
    return this.userService.userProfile(user);
  }

  @MessagePattern({ cmd: "all-users" })
  async getAllUsers(
    @Payload() query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<User>> {
    return this.userService.getAllUsers(query);
  }
}
