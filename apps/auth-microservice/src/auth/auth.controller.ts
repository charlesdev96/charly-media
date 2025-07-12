import { Controller } from "@nestjs/common";
import { AuthMicroserviceService } from "./auth.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { LoginDto, RegisterDto } from "./dto/create-user.dto";
import { ResponseData } from "../../../lib/interface/response.interface";
import { User } from "./entity/create-user.entity";

@Controller()
export class AuthMicroserviceController {
  constructor(private readonly authMicroService: AuthMicroserviceService) {}

  @MessagePattern({ cmd: "create-user" })
  async createUser(
    @Payload() registerUserDto: RegisterDto,
  ): Promise<ResponseData> {
    return await this.authMicroService.registerUser(registerUserDto);
  }

  @MessagePattern({ cmd: "login-user" })
  async login(@Payload() loginDto: LoginDto): Promise<ResponseData> {
    console.log("loging endpoint called");
    return await this.authMicroService.loginUser(loginDto);
  }

  @MessagePattern({ cmd: "find-user" })
  async findSingle(@Payload() userId: string): Promise<User | null> {
    return await this.authMicroService.findUserById(userId);
  }
}
