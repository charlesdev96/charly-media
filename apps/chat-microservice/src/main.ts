import { NestFactory } from "@nestjs/core";
import { ChatMicroserviceModule } from "./chat-microservice.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ChatMicroserviceModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://localhost:4222"],
      },
    },
  );
  await app.listen();
  console.log("Chat microservice is running");
}
void bootstrap();
