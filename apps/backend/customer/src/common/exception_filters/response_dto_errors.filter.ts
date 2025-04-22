import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseValidationError } from '@ts-rest/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { I18nContext } from 'nestjs-i18n';

// import { I18nTranslations } from "@/generated/i18n.generated";
import { CustomError } from '@/interfaces/custom_error.interface';

@Catch(ResponseValidationError)
export class ResponseDtoErrorsFilter
  implements ExceptionFilter<ResponseValidationError>
{
  constructor(private readonly configService: ConfigService) {}

  catch(exception: ResponseValidationError, host: ArgumentsHost) {
    console.error('ResponseValidationError');
    console.error(exception.getResponse());

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
      // TODO: Add a specific status code for this error
      statusCode: 500,
      code: exception.name,
      // TODO: Add a specific message for this error
      message: 'Unknown Error',
      // message: i18n?.t("errors.SERVER_ERROR"),
      details: undefined,
    };

    if (shouldShowErrorDetails) {
      errorResponse.message = exception.message;
      errorResponse.details = exception?.stack;
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
