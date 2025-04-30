import { z } from "zod";

export const FormStateSchema = z.object({
  data: z.record(z.string(), z.string()).optional(),
  error: z.string().optional(),
  success: z.boolean(),
});
type _FormState = z.infer<typeof FormStateSchema>;

export type FormState =
  | { data?: _FormState["data"]; success: true }
  | {
      data?: _FormState["data"];
      error: Required<_FormState>["error"];
      success: false;
    };
