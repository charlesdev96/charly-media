import { NestFactory } from "@nestjs/core";
import { PostMicroserviceModule } from "./post-microservice.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostMicroserviceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://localhost:4222"],
      },
    },
  );
  await app.listen();
  console.log("Posts microservice is running");
}
void bootstrap();
