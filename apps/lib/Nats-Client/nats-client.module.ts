import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { nats } from "../constants/nats-clients.constant";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: nats,
        transport: Transport.NATS,
        options: {
          // servers: ["nats://nats:4222"], //use the nats server address e.g localhosts since we are using docker compose we use the service name
          servers: ["nats://localhost:4222"],
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: nats,
        transport: Transport.NATS,
        options: {
          servers: ["nats://localhost:4222"], //use the nats server address e.g localhosts since we are using docker compose we use the service name
        },
      },
    ]),
  ],
})
export class NatsClientModule {}
