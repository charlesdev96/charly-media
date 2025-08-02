import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { nats } from "../../../lib/constants/nats-clients.constant";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { RegisterDto, LoginDto } from "../../../lib/dtos/user/create-user.dto";

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  constructor(@Inject(nats) private readonly natsClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.natsClient.connect();
    console.log("Auth microservice connected");
  }

  async createUser(createUserDto: RegisterDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "create-user" }, createUserDto),
    );
    return response;
  }

  async login(loginDto: LoginDto) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "login-user" }, loginDto),
    );
    return response;
  }
  async findUserById(userId: string) {
    const response = await firstValueFrom(
      this.natsClient.send({ cmd: "find-user" }, userId),
    );
    return response;
  }
}
