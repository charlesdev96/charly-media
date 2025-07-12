import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { User } from "../../../../apps/auth-microservice/src/auth/entity/create-user.entity";
import { PaginatedQueryDto } from "../../../lib/dtos/paginated-query.dto";
import { firstValueFrom } from "rxjs";
import { nats } from "../../../lib/constants/nats-clients.constant";

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
}
