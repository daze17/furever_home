import { z } from "zod";

// import { CustomError } from "@/models";

// export const ErrorResponseBody = CustomError;

// export const EmptyResponseBody = z.object({});

export const RateLimitError = z.object({
  message: z.string(),
  retry_after: z.number(),
});
