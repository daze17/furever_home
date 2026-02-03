import { cache } from "react";

import "server-only";

import { client } from "@/services/client";

export const getFavoritesCount = cache(async (): Promise<number | null> => {
  try {
    const response = await client.adoptionPosts.getFavoriteAdoptionPostsTotal();

    if (response.status !== 200) {
      return null;
    }

    return response.body.total;
  } catch {
    return null;
  }
});
