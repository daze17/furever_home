import { adoption_posts } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const AdoptionPostModel = createSelectSchema(adoption_posts);
export type AdoptionPostModel = z.infer<typeof AdoptionPostModel>;
