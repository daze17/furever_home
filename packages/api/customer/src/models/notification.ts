import { z } from "zod";

export const NotificationPayload = z.object({
  title: z.string(),
  body: z.string(),
  // Use z.union() for adding more types
  data: z.object({
    type: z.literal("new_chat_message"),
    chat_room_url: z.string(),
    unread_messages_count: z.number(),
    message: z.string().optional(),
  }),
});
export type NotificationPayload = z.infer<typeof NotificationPayload>;
