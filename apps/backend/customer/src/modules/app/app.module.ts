import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration, validate } from '@/common/config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { EmailQueueModule } from '@/modules/email_queue/email_queue.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ClsModule } from 'nestjs-cls';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    LoggerModule.forRoot({
      exclude: [
        {
          method: RequestMethod.ALL,
          path: '/health',
        },
      ],
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
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
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EmailQueueModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
