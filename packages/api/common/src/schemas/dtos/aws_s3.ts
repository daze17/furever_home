import { z } from "zod";

import { MimeTypeEnum } from "@/models/enum";

export const UploadFileResponseBody = z.object({
  key: z.string(),
  url: z.string(),
  originalname: z.string(),
  mimeType: MimeTypeEnum.or(z.any()),
});
export type UploadFileResponseBody = z.infer<typeof UploadFileResponseBody>;
