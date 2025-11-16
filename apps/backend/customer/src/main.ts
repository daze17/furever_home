// import fastifyMultipart from "@fastify/multipart";
import type { NestApplicationOptions } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";
import * as qs from "qs";

import { AllExceptionsFilter } from "@/common/exception_filters/all_exceptions.filter";
import { HttpExceptionsFilter } from "@/common/exception_filters/http_exceptions.filter";
import { RequestDtoErrorsFilter } from "@/common/exception_filters/request_dto_errors.filter";
import { ResponseDtoErrorsFilter } from "@/common/exception_filters/response_dto_errors.filter";
import { ZodErrorsFilter } from "@/common/exception_filters/zod_errors.filter";
import { LoggingInterceptor } from "@/interceptors/logging.interceptor";
import { AppModule } from "@/modules/app/app.module";

// import { initSentry } from "./sentry";
// import { setupSwagger } from "./swagger";

async function bootstrap() {
  // config
  const config: NestApplicationOptions = {
    bufferLogs: true,
  };
  const adapter = new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  });
  adapter.enableCors({
    // TODO: env
    origin: ["http://localhost:3001", "https://localhost:3000"],
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    config,
  );

  // Enable multipart/form-data support
  // await app.register(fastifyMultipart, {
  //   limits: {
  //     fileSize: 10 * 1024 * 1024, // 10MB,
  //     files: 5,
  //   },
  // });

  // initSentry(app);

  const configService = app.get<ConfigService>(ConfigService);

  // Error filters
  app.useGlobalFilters(
    new AllExceptionsFilter(configService),
    new HttpExceptionsFilter(configService),
    // TODO: zod error filter
    // new ZodErrorsFilter(configService),
    new RequestDtoErrorsFilter(configService),
    new ResponseDtoErrorsFilter(configService),
  );

  // Pino Logger
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  // Swagger
  // setupSwagger(app);

  const port = configService.get<number>("app.port")!;
  await app.listen(port, "0.0.0.0");
}
bootstrap();
