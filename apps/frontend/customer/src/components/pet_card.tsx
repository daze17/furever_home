"use client";

import { PetResponseBody } from "customer_api";
import { Heart } from "lucide-react";
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
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pet.name}
          <Heart
            className="ml-2 h-4 w-4 text-[#11D0BC]"
            fill="#11D0BC"
          />
        </CardTitle>
        <CardDescription>{`${petAge} years old`}</CardDescription>
        <ImageWithFallback
          src={pet.pet_image_url || ""}
          alt={pet.name}
          height={100}
          width={1000}
          fallbackSrc="/logo.svg"
          className="h-[220px] w-[440px] rounded-t-lg border object-cover"
        />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-sm">
            {speciesEmoji[pet.species]} {pet.species}
          </span>
          {pet.size && (
            <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
              {pet.size}
            </span>
          )}
          <span className={`rounded-full px-2 py-1 text-sm ${
            pet.pet_status === "adopting" ? "bg-green-100 text-green-800" : "bg-gray-100"
          }`}>
            {statusLabel[pet.pet_status]}
          </span>
        </div>
        {pet.notes && (
          <p className="mt-2 text-sm text-gray-600">{pet.notes}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full rounded-full py-2" asChild>
          <Link href={`/pets/${pet.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
