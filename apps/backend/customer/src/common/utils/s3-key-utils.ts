import { MimeTypeEnum } from "common_api";
import path from "path";

export interface ParsedS3Key {
  directory: string;
  filename: string;
  filenameWithoutExt: string;
  extension: string;
}

/**
 * Parses an S3 key into its components
 * @example parseS3Key("uploads/files/abc123.pdf")
 * // => { directory: "uploads/files", filename: "abc123.pdf", filenameWithoutExt: "abc123", extension: ".pdf" }
 */
export function parseS3Key(key: string): ParsedS3Key {
  const lastSlashIndex = key.lastIndexOf("/");
  const directory = key.substring(0, lastSlashIndex);
  const filename = key.substring(lastSlashIndex + 1);
  const lastDotIndex = filename.lastIndexOf(".");
  const filenameWithoutExt =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
  const extension = lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";

  return {
    directory,
    filename,
    filenameWithoutExt,
    extension,
  };
}

/**
 * Generates a preview key for a given S3 file key
 * @example generatePreviewKey("uploads/files/abc123.jpg", 512)
 * // => "uploads/files/previews/abc123_512w.jpg"
 */
export function generatePreviewKey(originalKey: string, width: number): string {
  const { directory, filenameWithoutExt } = parseS3Key(originalKey);
  return `${directory}/previews/${filenameWithoutExt}_${width}w.jpg`;
}

export function getMimeType(extension: string): MimeTypeEnum {
  switch (extension) {
    case "pdf":
      return MimeTypeEnum["application/pdf"];
    case "jpg":
      return MimeTypeEnum["image/jpg"];
    case "jpeg":
      return MimeTypeEnum["image/jpeg"];
    case "png":
      return MimeTypeEnum["image/png"];
    case "csv":
      return MimeTypeEnum["text/csv"];
    default:
      throw new Error(`Unsupported extension: ${extension}`);
  }
}

/**
 * Extracts and normalizes file extension from filename
 * @example getFileExtension("document.PDF") => "pdf"
 * @example getFileExtension("image.JPG") => "jpg"
 */
export function getFileExtension(filename: string): string {
  const ext = path.extname(filename);
  return ext ? ext.slice(1).toLowerCase() : "";
}

/**
 * Checks if file is a supported image format
 */
export function isImageFile(extension: string): boolean {
  return ["jpg", "jpeg", "png", "webp"].includes(extension);
}

/**
 * Checks if file is a PDF
 */
export function isPdfFile(extension: string): boolean {
  return extension === "pdf";
}

/**
 * Checks if file type supports preview generation
 */
export function supportsPreviewGeneration(extension: string): boolean {
  return isImageFile(extension) || isPdfFile(extension);
}
