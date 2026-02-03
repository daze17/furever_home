"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import { OwnAdoptionPostResponseBody } from "customer_api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { client } from "@/services/client";

export const AdoptionPostCard: React.FC<{
  post: OwnAdoptionPostResponseBody;
}> = ({ post }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
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

  const statusLabel = {
    active: "Идэвхтэй",
    inactive: "Идэвхгүй",
    pending: "Хүлээгдэж буй",
  };

  const statusColors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const primaryImage = pet.images?.find((img) => img.is_primary)?.image_url
    || pet.images?.[0]?.image_url
    || "/furever-home-dog.jpg";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await client.adoptionPosts.deleteAdoptionPost({
        params: { id: post.id },
      });

      if (response.status === 204) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete adoption post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#11D0BC] hover:shadow-lg">
      <CardHeader className="overflow-hidden p-0">
        <ImageWithFallback
          src={primaryImage}
          alt={pet.name}
          height={220}
          width={440}
          fallbackSrc="/furever-home-dog.jpg"
          className="h-[220px] w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-gray-900">
          <span className="truncate" title={pet.name}>
            {pet.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[post.post_status]}`}
          >
            {statusLabel[post.post_status]}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-500">{`${petAge} настай`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="truncate rounded-full bg-[#11D0BC]/10 px-2.5 py-1 text-xs font-medium text-[#11D0BC]">
            {speciesEmoji[pet.species]} {speciesLabel[pet.species]}
          </span>
          {post.price !== null && post.price !== undefined && (
            <span className="truncate rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-600">
              ₮{post.price.toLocaleString()}
            </span>
          )}
        </div>
        {post.notes && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-500">{post.notes}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex gap-2 border-t bg-gray-50/50 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          asChild
        >
          <Link href={`/adoptions/${post.id}`}>
            <Eye className="mr-1 h-4 w-4" />
            Харах
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          asChild
        >
          <Link href={`/adoptions/${post.id}/edit`}>
            <Edit className="mr-1 h-4 w-4" />
            Засах
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={() => {
            if (window.confirm(`Та "${pet.name}"-н үрчлүүлэх зарыг устгахдаа итгэлтэй байна уу?`)) {
              handleDelete();
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
