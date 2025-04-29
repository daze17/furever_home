import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';

import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const commonConfigs = {
          defaults: {
            from: `${configService.get<string>(
              'email.fromName',
            )} <${configService.get<string>('email.fromAddress')}>`,
          },
          template: {
            dir: path.join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: path.join(__dirname, 'templates/partials'),
              options: {
                strict: true,
              },
            },
          },
        };

        if (
          ['staging', 'production'].includes(
            configService.get<string>('app.env') || '',
          )
        ) {
          const client = new SESClient({
            region: configService.get<string>('ses.region'),
            credentials: {
              accessKeyId: configService.get<string>('ses.accessKey')!,
              secretAccessKey: configService.get<string>('ses.secretKey')!,
            },
          });

          return {
            ...commonConfigs,
            transport: {
              SES: { aws: { SendRawEmailCommand }, ses: client },
            },
          };
        }

        return {
          ...commonConfigs,
          transport: {
            host: configService.get<string>('email.host'),
            port: configService.get<number>('email.port'),
            secure: false,
            auth: {
              user: configService.get<string>('email.user'),
              pass: configService.get<string>('email.password'),
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
