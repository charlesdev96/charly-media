import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import {
  PaginatedResponseData,
  ResponseData,
} from "../../../lib/interface/response.interface";
import { Repository } from "typeorm";

@Injectable()
export class UserMicroserviceService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async userProfile(user: User): Promise<ResponseData> {
    const loggedUser = await this.userRepository.findOne({
      where: { userId: user.userId },
    });
    if (!loggedUser) {
      return {
        success: false,
        statusCode: 404,
        message: "User not found",
        error: "NotFound",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = loggedUser;
    return {
      success: true,
      message: "Profile displayed",
      data: result,
    };
  }

  async getAllUsers(
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseData<User>> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .select(["user.name", "user.email", "user.role", "user.createdAt"])
      .orderBy("user.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const responseResult: PaginatedResponseData<User> = {
      success: true,
      message: "List of users",
      data: items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };

    return responseResult;
  }
}
