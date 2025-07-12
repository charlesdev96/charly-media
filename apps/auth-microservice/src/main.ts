import { NestFactory } from "@nestjs/core";
import { AuthMicroserviceModule } from "./auth-microservice.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthMicroserviceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://localhost:4222"],
      },
    },
  );
  await app.listen();
  console.log("Auth microservice is running");
}
void bootstrap();
