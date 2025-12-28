import { BullModule } from "@nestjs/bullmq";
import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClsModule } from "nestjs-cls";
import { LoggerModule } from "nestjs-pino";

import { configuration, validate } from "@/common/config/configuration";
import { AuthModule } from "@/modules/auth/auth.module";
import { CustomerSettingsModule } from "@/modules/customer_settings/customer_settings.module";
import { EmailQueueModule } from "@/modules/email_queue/email_queue.module";
import { PetsModule } from "@/modules/pets/pets.module";

import { DatabaseModule } from "../database/database.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health.module";

@Module({
  imports: [
    LoggerModule.forRoot({
      exclude: [
        {
          method: RequestMethod.ALL,
          path: "/health",
        },
      ],
      pinoHttp: {
        transport: {
          target: "pino-pretty",
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>("redis.url"),
          // host: configService.get<string>("redis.host"),
          // port: configService.get<number>("redis.port"),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CustomerSettingsModule,
    EmailQueueModule,
    PetsModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
