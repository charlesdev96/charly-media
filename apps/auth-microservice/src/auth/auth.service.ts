import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/create-user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginDto, RegisterDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { ResponseData } from "../../../lib/interface/response.interface";
import { Payload } from "../../../lib/interface/payload.interface";

@Injectable()
export class AuthMicroserviceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<ResponseData> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      // throw new ConflictException("User with this email already exists");
      return {
        statusCode: 409,
        success: false,
        message: "User already exists",
        error: "Conflict",
      };
    }
    const hashedPassword = await this.harshedPassword(registerDto.password);
    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return {
      success: true,
      message: "User registered successfully",
      data: result,
    };
  }

  async loginUser(loginDto: LoginDto): Promise<ResponseData> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (
      !user ||
      !(await this.comparePassword(loginDto.password, user.password))
    ) {
      return {
        statusCode: 400,
        success: false,
        message: "Invalid credentials",
        error: "BadRequest",
      };
    }
    //generate a token
    const token = await this.generateToken(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      success: true,
      message: `Welcome back ${user.name} to our platform`,
      data: {
        result,
        token,
      },
    };
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: userId } });
  }

  private comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async generateToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload: Payload = {
      userId: user.userId,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
    });
  }
  private async generateAccessToken(user: User): Promise<string> {
    const payload: Payload = {
      userId: user.userId,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "7d",
    });
  }

  private async harshedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
