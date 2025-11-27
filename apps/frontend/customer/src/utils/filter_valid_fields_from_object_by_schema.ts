import { type ZodObject, type ZodTypeAny } from "zod";

/**
 * Filter the valid fields from the object based on the zod schema
 * @param schema - The schema to filter the fields from
 * @param input - The object to filter the fields from
 * @returns The filtered object
 */

export function filterValidFieldsFromObjectBySchema<
  T extends ZodObject<Record<string, ZodTypeAny>>,
>(schema: T, input: Record<string, unknown>): Partial<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  const shape = schema.shape;

  for (const key in shape) {
    const fieldSchema = shape[key];
    if (!fieldSchema) continue;

    const parsed = fieldSchema.safeParse(input[key]);
    if (parsed.success) {
      result[key] = input[key];
    } else {
      console.warn(
        `Failed to parse in parse_partial_object: ${key}:`,
        parsed.error,
      );
    }
  }

  return result;
}
