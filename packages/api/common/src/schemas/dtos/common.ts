import { z } from "zod";

import { CustomError } from "@/models";

export const ErrorResponseBody = CustomError;

export const EmptyResponseBody = z.object({});
