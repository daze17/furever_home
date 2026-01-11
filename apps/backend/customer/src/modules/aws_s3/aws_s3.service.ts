import { randomUUID } from "node:crypto";

import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadFileResponseBody } from "common_api";
import sharp from "sharp";

import {
  generatePreviewKey,
  getFileExtension,
  isPdfFile,
  supportsPreviewGeneration,
} from "@/common/utils/s3-key-utils";
import { S3ClientService } from "@/modules/aws_s3/aws_s3.repository";

@Injectable()
export class AwsS3Service {
  private readonly PREVIEW_IMAGE_WIDTHS = [160, 512, 1280];
  private readonly PREVIEW_IMAGE_QUALITY = 75;

  constructor(
    private readonly s3Client: S3ClientService,
    private readonly configService: ConfigService,
  ) {}

  async getFilePreview(key: string, width: number) {
    const closestSize = this.getClosestPreviewSize(width);
    const previewImageFileKey = generatePreviewKey(key, closestSize);

    try {
      // Try to fetch pre-generated preview
      const previewBytes = await this.getFileStream(previewImageFileKey);
      return {
        buffer: Buffer.from(previewBytes),
        contentType: "image/jpeg",
      };
    } catch (previewError) {
      // Preview not found, generate on-demand
      console.warn(
        `Preview not found for ${previewImageFileKey}, generating on-demand`,
      );

      try {
        // Fetch original file
        const originalBytes = await this.getFileStream(key);
        const originalBuffer = Buffer.from(originalBytes);

        const imageBuffer = originalBuffer;

        // Generate preview at requested size
        const metadata = await sharp(imageBuffer).metadata();
        const originalWidth = metadata.width || 0;

        let previewBuffer: Buffer;
        if (closestSize >= originalWidth) {
          // Use original size
          previewBuffer = await sharp(imageBuffer)
            .jpeg({ quality: this.PREVIEW_IMAGE_QUALITY })
            .toBuffer();
        } else {
          // Resize to target width
          previewBuffer = await sharp(imageBuffer)
            .resize({ width: closestSize, withoutEnlargement: true })
            .jpeg({ quality: this.PREVIEW_IMAGE_QUALITY })
            .toBuffer();
        }

        return {
          buffer: previewBuffer,
          contentType: "image/jpeg",
        };
      } catch (error) {
        console.error("Failed to generate preview on-demand:", error);
        throw new UnprocessableEntityException("PREVIEW_GENERATION_FAILED");
      }
    }
  }

  async deleteMultipleFiles(keys: string[]) {
    for (const key of keys) {
      await this.s3Client.delete(key);
    }
  }

  async deleteFile(key: string) {
    const objectKey = this.normalizeS3Key(key);
    await this.s3Client.delete(objectKey);
  }

  async getFileStream(key: string) {
    const objectKey = this.normalizeS3Key(key);
    return this.s3Client.getFileStream(objectKey);
  }

  async getFileBase64(key: string) {
    const objectKey = this.normalizeS3Key(key);
    return this.s3Client.getFileBase64(objectKey);
  }

  async uploadPrivateFile(file: Express.Multer.File, filePath: string) {
    try {
      const filename = randomUUID();
      const extension = getFileExtension(file.originalname);
      const fullFilename = extension ? `${filename}.${extension}` : filename;
      const response = await this.s3Client.upload(
        file,
        filePath,
        fullFilename,
        ObjectCannedACL.private,
      );

      return response;
    } catch (error) {
      console.error("upload private file failed", JSON.stringify(error));
      throw error;
    }
  }

  async uploadMultiplePublicFiles(
    files: Express.Multer.File[],
    filePath: string,
  ): Promise<UploadFileResponseBody[]> {
    const uploadedFiles: UploadFileResponseBody[] = [];

    try {
      for (const file of files) {
        const filename = randomUUID();
        const extension = getFileExtension(file.originalname);
        const fullFilename = extension ? `${filename}.${extension}` : filename;

        const response = await this.s3Client.upload(
          file,
          filePath,
          fullFilename,
          ObjectCannedACL.public_read,
        );

        uploadedFiles.push(response);
      }

      return uploadedFiles;
    } catch (error) {
      console.error("uploadMultipleFiles failed", JSON.stringify(error));

      await this.deleteMultipleFiles(uploadedFiles.map(({ key }) => key));

      throw error;
    }
  }

  async uploadMessageFiles(
    files: Express.Multer.File[],
    filePath: string,
  ): Promise<UploadFileResponseBody[]> {
    const processedFiles: UploadFileResponseBody[] = [];

    try {
      for (const file of files) {
        const extension = getFileExtension(file.originalname);

        // Only generate previews for PDFs and images
        if (supportsPreviewGeneration(extension)) {
          const thumbnailBuffer = file.buffer;

          const filename = randomUUID();
          // Upload the main file
          const uploadedFile = await this.s3Client.upload(
            file,
            filePath,
            `${filename}.${extension}`,
            ObjectCannedACL.private,
          );

          // Generate preview images with different widths
          const previews =
            await this.generateFilePreviewImages(thumbnailBuffer);

          // Upload the preview images files and get the 1280px presigned URL
          let previewUrl = uploadedFile.url;
          for (const preview of previews) {
            const previewImageFile = {
              buffer: preview.buffer,
              mimetype: "image/jpeg",
              originalname: uploadedFile.originalname,
            };

            const uploadedPreview = await this.s3Client.upload(
              previewImageFile,
              `${filePath}/previews`,
              `${filename}_${preview.width}w.jpg`,
              ObjectCannedACL.private,
            );

            // Use 1280px preview with presigned URL for LINE messages
            if (preview.width === 1280) {
              previewUrl = await this.generatePresignedUrl(uploadedPreview);
            }
          }

          // Push file with 1280px preview URL
          processedFiles.push({
            ...uploadedFile,
            url: previewUrl,
          });
        } else {
          // For non-image/PDF files, just upload normally
          const result = await this.uploadPrivateFileAndGeneratePresignedUrl(
            file,
            filePath,
          );
          processedFiles.push(result);
        }
      }

      return processedFiles;
    } catch (error) {
      console.error("uploadMessageFiles failed", JSON.stringify(error));
      // Cleanup already uploaded files
      await this.deleteMultipleFiles(processedFiles.map(({ key }) => key));
      throw error;
    }
  }

  private async generatePresignedUrl(response: UploadFileResponseBody) {
    const fileExpiresIn = this.configService.get<number>(
      "line.messaging.fileExpiresIn",
    )!;
    const presignedUrl = await this.s3Client.generatePresignedUrl(
      response.url,
      fileExpiresIn,
    );

    return presignedUrl;
  }

  private async generateFilePreviewImages(
    imageBuffer: Buffer,
  ): Promise<Array<{ width: number; buffer: Buffer }>> {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const originalWidth = metadata.width || 0;

      if (originalWidth === 0) {
        throw new Error("UNABLE_TO_DETERMINE_IMAGE_WIDTH");
      }

      const previews: Array<{ width: number; buffer: Buffer }> = [];

      for (const targetWidth of this.PREVIEW_IMAGE_WIDTHS) {
        let buffer: Buffer;

        if (targetWidth >= originalWidth) {
          // If target width is greater than or equal to original, use original image as-is
          buffer = await sharp(imageBuffer)
            .jpeg({ quality: this.PREVIEW_IMAGE_QUALITY })
            .toBuffer();
        } else {
          // Resize to target width
          buffer = await sharp(imageBuffer)
            .resize({ width: targetWidth, withoutEnlargement: true })
            .jpeg({ quality: this.PREVIEW_IMAGE_QUALITY })
            .toBuffer();
        }

        previews.push({ width: targetWidth, buffer });
      }

      return previews;
    } catch (error) {
      console.error("Failed to generate file previews:", error);
      throw new UnprocessableEntityException("PREVIEW_GENERATION_FAILED");
    }
  }

  private getClosestPreviewSize(requestedWidth: number): number {
    return this.PREVIEW_IMAGE_WIDTHS.reduce((prev, curr) => {
      return Math.abs(curr - requestedWidth) < Math.abs(prev - requestedWidth)
        ? curr
        : prev;
    });
  }

  private normalizeS3Key(key: string): string {
    let objectKey = key;
    if (objectKey.startsWith("https")) {
      objectKey = objectKey.replace(
        `https://${this.configService.get<string>("s3.host")}`,
        "",
      );
    }
    if (objectKey.startsWith("/")) {
      objectKey = objectKey.slice(1);
    }
    return objectKey;
  }

  private async uploadPrivateFileAndGeneratePresignedUrl(
    file: Express.Multer.File,
    filePath: string,
  ) {
    try {
      const filename = randomUUID();
      const extension = getFileExtension(file.originalname);
      const response = await this.s3Client.upload(
        file,
        filePath,
        `${filename}.${extension}`,
        ObjectCannedACL.private,
      );

      const fileExpiresIn = this.configService.get<number>(
        "line.messaging.fileExpiresIn",
      )!;

      // For private files, we need to generate a presigned url to access the file
      const presignedUrl = await this.s3Client.generatePresignedUrl(
        response.url,
        fileExpiresIn,
      );

      return {
        ...response,
        url: presignedUrl,
      };
    } catch (error) {
      console.error("upload private file failed", JSON.stringify(error));
      throw error;
    }
  }
}
