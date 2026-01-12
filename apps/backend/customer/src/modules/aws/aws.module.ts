import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Module } from "nestjs-s3";

import { AwsService } from "./aws.service";

// TODO: Remove after migrating all logics into AWS S3 module
@Global()
@Module({
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
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
