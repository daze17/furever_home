import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { setupZodErrorMap } from '@/common/exception_filters/setup_zod_error_map';

@Injectable()
export class ZodErrorMapInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const locale = I18nContext.current(context)?.lang;

    // setupZodErrorMap(locale);
    setupZodErrorMap();

    return next.handle();
  }
}
