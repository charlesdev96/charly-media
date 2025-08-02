import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResponseData } from "../../../lib/interface/response.interface";
import { minutes, Throttle } from "@nestjs/throttler";
import { LoginThrottlerMessage } from "./guards/login.throttler.guard";
import { RegisterDto, LoginDto } from "../../../lib/dtos/user/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() registerDto: RegisterDto): Promise<ResponseData> {
    return await this.authservice.createUser(registerDto);
  }

  @Throttle({
    default: { ttl: minutes(5), blockDuration: minutes(30), limit: 3 },
  })
  @UseGuards(LoginThrottlerMessage)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto): Promise<ResponseData> {
    return await this.authservice.login(loginDto);
  }
}
