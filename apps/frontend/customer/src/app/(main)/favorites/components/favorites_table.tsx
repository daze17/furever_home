"use client";

import { HeartOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PetsListResponseBody, PetResponseBody } from "customer_api";
import Link from "next/link";

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
  pets: PetsListResponseBody;
};

export const FavoritesTable: React.FC<Props> = ({ pets }) => {
  const router = useRouter();
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  const handleRemoveFavorite = async (pet: PetResponseBody) => {
    setRemovingIds((prev) => new Set(prev).add(pet.id));

    try {
      const response = await client.pets.removeFavoritePet({
        params: { id: pet.id },
        body: {},
      });

      if (response.status === 204) {
        toast.success(`${pet.name} дуртай жагсаалтаас хасагдлаа`);
        router.refresh();
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(pet.id);
        return next;
      });
    }
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
          {pets.map((pet) => (
            <TableRow
              key={pet.id}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >
              <TableCell>
                <Link href={`/pets/${pet.id}`}>
                  <ImageWithFallback
                    src={"/furever-home-dog.jpg"}
                    alt={pet.name}
                    height={48}
                    width={48}
                    fallbackSrc="/furever-home-dog.jpg"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/pets/${pet.id}`}
                  className="font-medium text-gray-900 hover:text-[#11D0BC] hover:underline"
                >
                  {pet.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#11D0BC]/10 px-2.5 py-1 text-xs font-medium text-[#11D0BC]">
                  {speciesEmoji[pet.species]} {speciesLabel[pet.species]}
                </span>
              </TableCell>
              <TableCell>
                {pet.size ? (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {sizeLabel[pet.size]}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {calculateAge(pet.birth_date)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[pet.pet_status] || "bg-gray-100 text-gray-600"}`}
                >
                  {statusLabel[pet.pet_status] || pet.pet_status}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button
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
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
