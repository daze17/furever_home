import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { url } = request;

    if (url !== '/health') {
      // TODO: If possible, pino's serializer is preferable
      // But by some reason, body cannot be obtained from request using pino's serializer
      // Maybe helpful if we understand the serializer's behavior

      this.logger.log({
        // 'body' cannot be added to the 'req' because of pino-http's default serializer
        // If added into req, the 'body' will be overwritten to undefined by the default serializer
        body: request.body ? request.body : {},
        // Logging 'req' object to overwrite the default full req object from pino-http auto-logging
        req: {
          id: request.id,
        },
      });
    }

    return next.handle();
  }
}
