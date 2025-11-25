import { z } from "zod";

export const paginationQuery = <T>(sorting_field: z.ZodType<T>) =>
  z.object({
    current_page: z.coerce.number().optional(),
    per_page: z.coerce.number().optional(),
    sorting_field,
    sorting_order: z.enum(["ascending", "descending"]),
  });
export type PaginationQuery<T> = z.infer<ReturnType<typeof paginationQuery<T>>>;

export const PaginationMeta = z.object({
  total: z.number(),
  per_page: z.number(),
  current_page: z.number(),
});
export type PaginationMeta = z.infer<typeof PaginationMeta>;
