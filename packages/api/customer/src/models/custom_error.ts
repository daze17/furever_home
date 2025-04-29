import { z } from "zod";

export const CustomError = z.object({
  timestamp: z.string(),
  path: z.string(),
  statusCode: z.number().int(),
  code: z.string().optional(),
  message: z.string(),
  details: z.string().optional(),
});
