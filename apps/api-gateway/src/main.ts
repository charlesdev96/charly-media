import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/filters/globalErrorFilter.filter";
import { TimeOutInterceptor } from "./common/interceptors/timeout.interceptor";
import { MicroserviceResponseInterceptor } from "./common/interceptors/microservice-response.interceptor";
import { RedisIoAdapter } from "./socket.io/redis/redis.io.adapter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });
  // Set up Redis Socket.IO Adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips properties that dont have decorators
      forbidNonWhitelisted: true,
      transform: true, //automatically transform payloads to be objects types according to their dto  classes
      disableErrorMessages: false,
    }),
  );
  app.setGlobalPrefix("api/v1");
  const PORT = process.env.PORT ?? 3000;
  //global error catch
  app.useGlobalInterceptors(new MicroserviceResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  await app.listen(PORT, () => {
    console.log(`Microservice is listening on port ${PORT}`);
  });
}
void bootstrap();
