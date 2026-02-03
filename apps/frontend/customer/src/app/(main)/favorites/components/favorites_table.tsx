"use client";

import { HeartOff } from "lucide-react";
import { useState } from "react";

import { AdoptionPostsListResponseBody, PetResponseBody } from "customer_api";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "ui";

import { FavoriteRemoveButton } from "@/components/favorite_remove_button";
import ImageWithFallback from "@/components/image_with_fallback";
import { client } from "@/services/client";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  fish: "🐠",
  other: "🐾",
};

const speciesLabel: Record<string, string> = {
  dog: "Нохой",
  cat: "Муур",
  bird: "Шувуу",
  fish: "Загас",
  other: "Бусад",
};

const sizeLabel: Record<string, string> = {
  small: "Жижиг",
  medium: "Дунд",
  large: "Том",
};

const statusLabel: Record<string, string> = {
  adopting: "Үрчлүүлэх",
  has_owner: "Эзэнтэй",
  inactive: "Идэвхгүй",
};

const statusColors: Record<string, string> = {
  adopting: "bg-green-100 text-green-700",
  has_owner: "bg-blue-100 text-blue-700",
  inactive: "bg-gray-100 text-gray-600",
};

const calculateAge = (birthDate: string | Date | null): string => {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  if (years === 0) {
    const months = now.getMonth() - birth.getMonth();
    return months <= 0 ? "1 сар" : `${months} сар`;
  }
  return `${years} нас`;
};

type Props = {
  posts: AdoptionPostsListResponseBody;
};

export const FavoritesTable: React.FC<Props> = ({ posts }) => {
  const router = useRouter();
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const handleRemoveFavorite = async (pet: PetResponseBody) => {
    setRemovingIds((prev) => new Set(prev).add(pet.id));

    // TODO: WRONG
    // try {
    //   const response = await client.pets.removeFavoritePet({
    //     params: { id: pet.id },
    //     body: {},
    //   });

    //   if (response.status === 204) {
    //     toast.success(`${pet.name} дуртай жагсаалтаас хасагдлаа`);
    //     router.refresh();
    //   } else {
    //     toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    //   }
    // } catch {
    //   toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    // } finally {
    //   setRemovingIds((prev) => {
    //     const next = new Set(prev);
    //     next.delete(pet.id);
    //     return next;
    //   });
    // }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-[80px]">Зураг</TableHead>
            <TableHead>Нэр</TableHead>
            <TableHead>Төрөл</TableHead>
            <TableHead>Хэмжээ</TableHead>
            <TableHead>Нас</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead className="w-[100px] text-center">Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.pet.id}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >
              <TableCell>
                <Link href={`/pets/${post.pet.id}`}>
                  <ImageWithFallback
                    src={"/furever-home-dog.jpg"}
                    alt={post.pet.name}
                    height={48}
                    width={48}
                    fallbackSrc="/furever-home-dog.jpg"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/pets/${post.pet.id}`}
                  className="font-medium text-gray-900 hover:text-[#11D0BC] hover:underline"
                >
                  {post.pet.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#11D0BC]/10 px-2.5 py-1 text-xs font-medium text-[#11D0BC]">
                  {speciesEmoji[post.pet.species]}{" "}
                  {speciesLabel[post.pet.species]}
                </span>
              </TableCell>
              <TableCell>
                {post.pet.size ? (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {sizeLabel[post.pet.size]}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {calculateAge(post.pet.birth_date)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[post.pet.pet_status] || "bg-gray-100 text-gray-600"}`}
                >
                  {statusLabel[post.pet.pet_status] || post.pet.pet_status}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <FavoriteRemoveButton postId={post.id} />
                {/*<Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(pet);
                  }}
                  disabled={removingIds.has(pet.id)}
                  className="text-gray-500 hover:bg-red-50 hover:text-red-600"
                  title="Дуртай жагсаалтаас хасах"
                >
                  <HeartOff className="h-4 w-4" />
                </Button>*/}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
