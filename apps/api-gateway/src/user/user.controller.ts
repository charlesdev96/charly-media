import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards";
import { currentUser } from "../auth/decorators/currentUser.decorator";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @HttpCode(HttpStatus.OK)
  async profile(@currentUser() user: User) {
    return this.userService.getProfile(user);
  }

  @Get("all-user")
  @HttpCode(HttpStatus.OK)
  async allUsers(@Query() query: PaginatedQueryDto) {
    return this.userService.allUsers(query);
  }
}
