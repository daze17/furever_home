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

// import { FavoriteButton } from "@/components/favorite_button";
import ImageWithFallback from "@/components/image_with_fallback";
import {
  petStatusLabel,
  sizeLabel,
  speciesEmoji,
  speciesLabel,
} from "@/utils/pet_labels";

export const PetCard: React.FC<{
  pet: PetResponseBody;
}> = ({ pet }) => {
  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#11D0BC] hover:shadow-lg">
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
        <CardTitle className="flex items-center justify-between gap-2 text-gray-900">
          <span className="truncate" title={pet.name}>{pet.name}</span>
          {/* <FavoriteButton petId={pet.id} petName={pet.name} variant="icon" className="text-gray-400" /> */}
          <Heart className="h-5 w-5 shrink-0 text-[#11D0BC] transition-transform duration-200 group-hover:scale-110" fill="#11D0BC" />
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
          <span
            className={`truncate rounded-full px-2.5 py-1 text-xs font-medium ${
              pet.pet_status === "adopting"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {petStatusLabel[pet.pet_status]}
          </span>
        </div>
        {pet.notes && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{pet.notes}</p>}
      </CardContent>
      <CardFooter className="mt-auto border-t bg-gray-50/50 pt-3">
        <Button className="w-full rounded-full bg-[#11D0BC] py-2 transition-colors hover:bg-[#0fb8a6]" asChild>
          <Link href={`/pets/${pet.id}`}>Дэлгэрэнгүй</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
