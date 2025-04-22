import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
// import { I18nContext } from "nestjs-i18n";
import { ZodError } from 'zod';

// import { I18nTranslations } from "@/generated/i18n.generated";
import { CustomError } from '@/interfaces/custom_error.interface';

@Catch(ZodError)
export class ZodErrorsFilter implements ExceptionFilter<ZodError> {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: ZodError, host: ArgumentsHost) {
    console.error('ZodErrorsFilter');
    console.error(exception.errors);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const appEnv = this.configService.get<string>('APP_ENV');
    const shouldShowErrorDetails =
      appEnv !== 'staging' && appEnv !== 'production';

    // const i18n = I18nContext.current<I18nTranslations>(host);

    const errorResponse: CustomError = {
      timestamp: new Date().toISOString(),
      path: request.url,
      // TODO: Change status code and message for more appropriate one
      statusCode: 500,
      code: exception.name,
      // message: i18n?.t("errors.SERVER_ERROR"),
      message: 'Unknown Error',
      details: undefined,
    };

    if (shouldShowErrorDetails) {
      errorResponse.message = exception.message;
      errorResponse.details = exception.issues;
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
