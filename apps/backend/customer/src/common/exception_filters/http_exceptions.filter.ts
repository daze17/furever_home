import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { I18nContext } from 'nestjs-i18n';

// import { I18nTranslations } from "@/generated/i18n.generated";
import { CustomError } from '@/interfaces/custom_error.interface';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HttpExceptionsFilter');
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const statusCode = exception.getStatus();
    const message = exception.getResponse() as string;

    // const i18n = I18nContext.current<I18nTranslations>(host);

    const errorResponse: CustomError = {
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode,
      code: exception.message,
      // TODO: Add error messages to i18n
      // message: i18n?.t(`errors.${message}` as any),
      message: 'Unknown Error',
    };

    response.status(statusCode).send(errorResponse);
  }
}
