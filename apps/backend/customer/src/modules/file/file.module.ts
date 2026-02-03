import { Module } from "@nestjs/common";

import { AwsS3Module } from "@/modules/aws_s3/aws_s3.module";

import { FileController } from "./file.controller";

@Module({
  imports: [AwsS3Module],
  controllers: [FileController],
})
export class FileModule {}
