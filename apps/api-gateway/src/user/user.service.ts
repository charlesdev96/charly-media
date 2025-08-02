import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import { firstValueFrom } from "rxjs";
import { nats } from "../../../lib/constants/nats-clients.constant";
import { User } from "../../../lib/entities/create-user.entity";
import { SearchUsersDto } from "../../../../apps/lib/dtos/user";

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(@Inject(nats) private readonly natsClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("User microservice connected");
  }

  async getProfile(user: User) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "profile" }, user),
    );
    return response;
  }

  async allUsers(query: PaginatedQueryDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "all-users" }, query),
    );
    return response;
  }

  async searchUsers(query: SearchUsersDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "search-user" }, query),
    );
    return response;
  }
}
