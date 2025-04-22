import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { I18nContext } from 'nestjs-i18n';

// import { I18nTranslations } from '@/generated/i18n.generated';
import { CustomError } from '@/interfaces/custom_error.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    console.error('AllExceptionsFilter');
    console.error(exception);

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
      statusCode: 500,
      message: 'Unknown Error',
      // message: i18n?.t('errors.SERVER_ERROR'),
    };

    if (exception instanceof Error && shouldShowErrorDetails) {
      errorResponse.message = exception.message;
    } else {
      console.log('Unknown Error', exception);
    }

    response.status(errorResponse.statusCode).send(errorResponse);
  }
}
