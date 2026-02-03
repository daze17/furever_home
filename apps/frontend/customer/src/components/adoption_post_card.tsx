"use client";

import { HeartIcon } from "lucide-react";

import { AdoptionPostResponseBody } from "customer_api";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui";

import ImageWithFallback from "@/components/image_with_fallback";

import { FavoriteAddButton } from "./favorite_add_button";
import { FavoriteRemoveButton } from "./favorite_remove_button";

export const AdoptionPostCard: React.FC<{
  post: AdoptionPostResponseBody;
  linkPrefix?: string;
}> = ({ post, linkPrefix = "/pets" }) => {
  const pet = post.pet;
  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : 0;

  const speciesEmoji = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    other: "🐾",
  };

  const speciesLabel = {
    dog: "Нохой",
    cat: "Муур",
    bird: "Шувуу",
    fish: "Загас",
    other: "Бусад",
  };

  const sizeLabel = {
    small: "Жижиг",
    medium: "Дунд",
    large: "Том",
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return "Үнэгүй";
    return `${price.toLocaleString()}₮`;
  };

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#11D0BC] hover:shadow-lg">
      <CardHeader className="relative overflow-hidden p-0">
        <ImageWithFallback
          src={"/furever-home-dog.jpg"}
          alt={pet.name}
          height={220}
          width={440}
          fallbackSrc="/furever-home-dog.jpg"
          className="h-[220px] w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Price Badge */}
        <div className="absolute right-2 top-2 rounded-full bg-[#11D0BC] px-3 py-1 text-sm font-semibold text-white shadow-md">
          {formatPrice(post.price)}
        </div>
      </CardHeader>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-gray-900">
          <span className="truncate" title={pet.name}>
            {pet.name}
          </span>
          {post.is_favorite ? (
            <FavoriteRemoveButton postId={post.id} />
          ) : (
            <FavoriteAddButton postId={post.id} />
          )}
        </CardTitle>
        <CardDescription className="text-gray-500">{`${petAge} настай`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="truncate rounded-full bg-[#11D0BC]/10 px-2.5 py-1 text-xs font-medium text-[#11D0BC]">
            {speciesEmoji[pet.species]} {speciesLabel[pet.species]}
          </span>
          {pet.size && (
            <span className="truncate rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {sizeLabel[pet.size]}
            </span>
          )}
        </div>
        {post.notes && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-500">
            {post.notes}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t bg-gray-50/50 pt-3">
        <Button
          className="w-full rounded-full bg-[#11D0BC] py-2 transition-colors hover:bg-[#0fb8a6]"
          asChild
        >
          <Link href={`${linkPrefix}/${post.id}`}>Дэлгэрэнгүй</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
