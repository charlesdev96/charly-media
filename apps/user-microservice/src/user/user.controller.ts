import { Controller } from "@nestjs/common";
import { UserMicroserviceService } from "./user.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../lib/interface/response.interface";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import { User } from "../../../lib/entities/create-user.entity";
import { SearchUsersDto } from "../../../../apps/lib/dtos/user";

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

  @MessagePattern({ cmd: "search-user" })
  async searchUser(
    @Payload() query: SearchUsersDto,
  ): Promise<PaginatedResponseData<User>> {
    return this.userService.searchUsers(query);
  }
}
