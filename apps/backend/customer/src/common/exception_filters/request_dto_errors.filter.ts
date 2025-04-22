import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestValidationError } from '@ts-rest/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { I18nContext } from 'nestjs-i18n';

// import { I18nTranslations } from "@/generated/i18n.generated";
import { CustomError } from '@/interfaces/custom_error.interface';

@Catch(RequestValidationError)
export class RequestDtoErrorsFilter
  implements ExceptionFilter<RequestValidationError>
{
  constructor(private readonly configService: ConfigService) {}

  catch(exception: RequestValidationError, host: ArgumentsHost) {
    console.error('RequestValidationError');
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
      statusCode: 400,
      code: exception.name,
      // TODO: Add a specific message for this error
      message: 'Unknown Error',
      // message: i18n?.t("errors.SERVER_ERROR"),
      details: undefined,
    };

    if (shouldShowErrorDetails) {
      errorResponse.message = exception.message;
      errorResponse.details =
        exception.body ?? 'Error details are not available';
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
