import { SetMetadata } from "@nestjs/common";

export const EMAIL_RATE_LIMIT_KEY = "email_rate_limit";

export const EmailRateLimit = (ttl: number) =>
  SetMetadata(EMAIL_RATE_LIMIT_KEY, ttl);
