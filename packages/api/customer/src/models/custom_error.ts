import { z } from "zod";

// export const CustomError = z.object({
//   timestamp: z.string(),
//   path: z.string(),
//   statusCode: z.number().int(),
//   code: z.string().optional(),
//   message: z.string(),
//   details: z.string().optional(),
// });

export const CustomError = z.object({
  code: z.string(),
  details: z.string().optional(),
  message: z.string().optional(),
});
export type CustomError = z.infer<typeof CustomError>;

export const isCustomError = (value: unknown): value is CustomError => {
  return CustomError.safeParse(value).success;
};
