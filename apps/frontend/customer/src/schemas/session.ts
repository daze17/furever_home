import { SessionSchema } from "api/customer";
import { z } from "zod";

export const Session = z.object({
  accessToken: z.string(),
});
export type Session = z.infer<typeof Session>;

export const SessionPayload = SessionSchema;
export type SessionPayload = z.infer<typeof SessionPayload>;
