import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "nestjs-s3";

import { S3ClientService } from "./aws_s3.repository";
import { AwsS3Service } from "./aws_s3.service";

@Global()
@Module({
  providers: [S3ClientService, AwsS3Service],
  imports: [
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = ["production", "staging"].includes(
          configService.get<string>("app.env")!,
        );
        return {
          config: {
            credentials: isProd
              ? {
                  accessKeyId: configService.get<string>("aws.accessKey")!,
                  secretAccessKey: configService.get<string>("aws.secretKey")!,
                }
              : {
                  accessKeyId: configService.get<string>("minio.user")!,
                  secretAccessKey: configService.get<string>("minio.password")!,
                },
            region: configService.get<string>("aws.region")!,
            endpoint: isProd
              ? undefined
              : `http://localhost:${configService.get<string>("minio.port")!}`,
            forcePathStyle: true,
            signatureVersion: "v4",
          },
        };
      },
    }),
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
