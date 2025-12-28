"use client";

import { Heart } from "lucide-react";

import { PetResponseBody } from "customer_api";
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

export const PetCard: React.FC<{
  pet: PetResponseBody;
}> = ({ pet }) => {
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

  const statusLabel = {
    adopting: "Available",
    has_owner: "Adopted",
    inactive: "Inactive",
  };

  return (
    <Card className="group overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#11D0BC] hover:shadow-lg">
      <CardHeader className="overflow-hidden p-0">
        <ImageWithFallback
          // src={pet.pet_image_url}
          src={"/furever-home-dog.jpg"}
          alt={pet.name}
          height={220}
          width={440}
          fallbackSrc="/furever-home-dog.jpg"
          className="h-[220px] w-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-gray-900">
          {pet.name}
          <Heart className="ml-2 h-5 w-5 text-[#11D0BC] transition-transform duration-200 group-hover:scale-110" fill="#11D0BC" />
        </CardTitle>
        <CardDescription className="text-gray-500">{`${petAge} years old`}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#11D0BC]/10 px-3 py-1 text-sm font-medium text-[#11D0BC]">
            {speciesEmoji[pet.species]} {pet.species}
          </span>
          {pet.size && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              {pet.size}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              pet.pet_status === "adopting"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabel[pet.pet_status]}
          </span>
        </div>
        {pet.notes && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{pet.notes}</p>}
      </CardContent>
      <CardFooter className="border-t bg-gray-50/50 pt-3">
        <Button className="w-full rounded-full bg-[#11D0BC] py-2 transition-colors hover:bg-[#0fb8a6]" asChild>
          <Link href={`/pets/${pet.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
