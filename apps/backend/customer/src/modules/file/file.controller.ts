import { Controller, Res } from "@nestjs/common";
import { TsRest, TsRestHandler, tsRestHandler } from "@ts-rest/nest";
// import * as adminContract from "admin_api/contracts";
import type { FastifyReply } from "fastify";

import { getFileExtension, getMimeType } from "@/common/utils/s3-key-utils";
import { AwsS3Service } from "@/modules/aws_s3/aws_s3.service";

@TsRest({ validateResponses: true })
@Controller()
export class FileController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  // @TsRestHandler(adminContract.file.getFileByKey)
  // async getFileByKey(@Res() response: FastifyReply) {
  //   return tsRestHandler(adminContract.file.getFileByKey, async ({ query }) => {
  //     const file = await this.awsS3Service.getFileStream(query.key);

  //     // File extension is the last part of the key
  //     const extension = getFileExtension(query.key);
  //     const mimeType = getMimeType(extension);

  //     const safeFileName = encodeURIComponent(query.key.split("/").pop() ?? "");

  //     return response
  //       .header("Content-Type", mimeType)
  //       .header(
  //         "Content-Disposition",
  //         `attachment; filename*=UTF-8''${safeFileName}`,
  //       )
  //       .send(file);
  //   });
  // }
}
