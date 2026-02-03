"use client";

import { Heart } from "lucide-react";
import { use } from "react";

import Link from "next/link";

import { Badge, Button } from "ui";

import { useFavoritesCount } from "@/contexts/favorites_count";

export const FavoritesButton = () => {
  const { favoritesCountPromise } = useFavoritesCount();
  const count = use(favoritesCountPromise);

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/favorites" className="flex items-center gap-2">
        <span className="relative">
          <Heart size={20} strokeWidth={2} />
          {count !== null && count > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center p-0 text-[10px]">
              {count > 99 ? "99+" : count}
            </Badge>
          )}
        </span>
        <span className="font-medium">Таалагдсан</span>
      </Link>
    </Button>
  );
};
