import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/filters/globalErrorFilter.filter";
import { TimeOutInterceptor } from "./common/interceptors/timeout.interceptor";
import { MicroserviceResponseInterceptor } from "./common/interceptors/microservice-response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips properties that dont have decorators
      forbidNonWhitelisted: true,
      transform: true, //automatically transform payloads to be objects types according to their dto  classes
      disableErrorMessages: false,
    }),
  );
  //global error catch
  app.useGlobalInterceptors(new MicroserviceResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
