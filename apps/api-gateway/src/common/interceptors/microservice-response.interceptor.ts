/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class MicroserviceResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (
          response?.statusCode &&
          response.statusCode >= 400 &&
          response.statusCode < 600
        ) {
          throw new HttpException(response.message, response.statusCode);
        }

        return response;
      }),
    );
  }
}
