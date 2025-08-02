import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Server as SocketIOServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` });
    const subClient = pubClient.duplicate();
    console.log("🔄 Connecting to Redis...");

    // await Promise.all([pubClient.connect(), subClient.connect()]);
    await pubClient.connect();
    await subClient.connect();
    console.log("✅ Redis Socket.IO Adapter is now active");

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): SocketIOServer {
    const server = super.createIOServer(port, options) as SocketIOServer;
    server.adapter(this.adapterConstructor);
    console.log("✅ Redis Socket.IO Adapter is now active");
    return server;
  }
}
