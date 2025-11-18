import { z } from "zod";

export const EnumReference = <T>(schema: z.ZodType<T>) =>
  z.object({
    code: schema,
    name: z.string().nullable(),
  });
export type EnumReference = z.infer<ReturnType<typeof EnumReference>>;
