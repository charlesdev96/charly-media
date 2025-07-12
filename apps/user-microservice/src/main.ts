import { NestFactory } from "@nestjs/core";
import { UserMicroserviceModule } from "./user-microservice.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserMicroserviceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://localhost:4222"],
      },
    },
  );
  await app.listen();
  console.log("User microservice is running");
}
void bootstrap();
