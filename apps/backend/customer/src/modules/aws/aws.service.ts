import { S3 } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { InjectS3 } from "nestjs-s3";
import path from "path";

export type FileToUpload = {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class AwsService {
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {}

  async upload(file: FileToUpload, type: string) {
    try {
      const { mimetype, originalname, buffer } = file;
      const fileName = randomUUID();
      const ext = path.extname(originalname);

      let key = `${type}/${fileName}`;
      if (ext) key += `${ext}`;

      const bucket = this.configService.get<string>("s3.bucket")!;

      const response = await this.s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype ?? undefined,
      });

      const {
        $metadata: { httpStatusCode },
      } = response;

      if (httpStatusCode !== 200) {
        console.log("s3 error response", JSON.stringify(response));
        throw new Error("OBJECT_PUT_FAILED");
      }

      return key;
    } catch (error) {
      console.error("upload error", JSON.stringify(error));
      throw new Error("FILE_UPLOAD_FAILED");
    }
  }
}
