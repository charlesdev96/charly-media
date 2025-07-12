import { NestFactory } from "@nestjs/core";
import { PostMicroserviceModule } from "./post-microservice.module";

async function bootstrap() {
  const app = await NestFactory.create(PostMicroserviceModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
