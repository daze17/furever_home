import { ObjectCannedACL, S3 } from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Hash } from "@smithy/hash-node";
import { HttpRequest } from "@smithy/protocol-http";
import { parseUrl } from "@smithy/url-parser";
import { MimeTypeEnum } from "common_api";
import { UploadFileResponseBody } from "common_api";
import { InjectS3 } from "nestjs-s3";

@Injectable()
export class S3ClientService {
  private readonly presigner: S3RequestPresigner;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
  ) {
    this.presigner = new S3RequestPresigner({
      region: this.configService.get<string>("aws.region")!,
      credentials: {
        accessKeyId: this.configService.get<string>("aws.accessKey")!,
        secretAccessKey: this.configService.get<string>("aws.secretKey")!,
      },
      sha256: Hash.bind(null, "sha256"),
    });
  }

  isProd = ["production", "staging"].includes(
    this.configService.get<string>("app.env")!,
  );

  DEFAULT_BUCKET = this.isProd
    ? this.configService.get<string>("s3.bucket")
    : this.configService.get<string>("minio.bucket");
  BASE_URL = this.isProd
    ? `https://${this.DEFAULT_BUCKET}.s3.${this.configService.get<string>("aws.region")}.amazonaws.com`
    : `http://localhost:${this.configService.get<string>("minio.port")}`;

  async delete(key: string) {
    try {
      await this.s3.deleteObject({
        Bucket: this.DEFAULT_BUCKET,
        Key: key,
      });
    } catch (error) {
      // ユーザーにS3のファイルを削除させる要件はないので、エラーは無視する
      console.error("delete error", JSON.stringify(error));
    }
  }

  async getFileStream(key: string) {
    const response = await this.s3.getObject({
      Bucket: this.DEFAULT_BUCKET,
      Key: key,
    });

    const {
      $metadata: { httpStatusCode },
    } = response;

    if (httpStatusCode !== 200 || !response.Body) {
      console.log("s3 error response", JSON.stringify(response));
      throw new Error("FILE_FETCH_FAILED");
    }

    return await response.Body.transformToByteArray();
  }

  async getFileBase64(key: string) {
    const response = await this.s3.getObject({
      Bucket: this.DEFAULT_BUCKET,
      Key: key,
    });

    const {
      $metadata: { httpStatusCode },
    } = response;

    if (httpStatusCode !== 200 || !response.Body) {
      console.log("s3 error response", JSON.stringify(response));
      throw new Error("FILE_FETCH_FAILED");
    }

    return await response.Body.transformToString("base64");
  }

  async generatePresignedUrl(fileUrl: string, expiresIn: number) {
    const url = parseUrl(fileUrl);

    const signedUrlObject = await this.presigner.presign(
      new HttpRequest({
        ...url,
        method: "GET",
      }),
      {
        expiresIn,
      },
    );

    return formatUrl(signedUrlObject);
  }

  async upload(
    file: Pick<Express.Multer.File, "buffer" | "mimetype" | "originalname">,
    filePath: string,
    fileName: string,
    acl: ObjectCannedACL,
  ): Promise<UploadFileResponseBody> {
    try {
      const { buffer, mimetype, originalname } = file;

      let key = `${filePath}/${fileName}`;

      const response = await this.s3.putObject({
        Bucket: this.DEFAULT_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: acl,
      });

      const {
        $metadata: { httpStatusCode },
      } = response;

      if (httpStatusCode !== 200) {
        console.log("s3 error response", JSON.stringify(response));
        throw new Error();
      }

      return {
        key,
        mimeType: mimetype as MimeTypeEnum,
        url: `${this.BASE_URL}/${key}`,
        originalname,
      };
    } catch (error) {
      console.log(error, "error");
      throw new Error("FILE_UPLOAD_FAILED");
    }
  }
}
