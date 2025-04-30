"use client";

// import { PetsResponse } from "api/customer";
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
// import { SpeciesTag } from "@/components/species_tag";

export const PetCard: React.FC<{
  // pet: PetsResponse;
  pet: any;
}> = ({ pet }) => {
  const petAge = pet.birthDate
    ? new Date().getFullYear() - new Date(pet.birthDate).getFullYear()
    : 0;
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {pet.name}
          <Heart
            className="ml-2 h-4 w-4 text-[#11D0BC]"
            //  if added to favorites fill or empty
            fill="#11D0BC"
          />
        </CardTitle>
        <CardDescription>{`${petAge} настай`}</CardDescription>
        <ImageWithFallback
          src={pet.petImage}
          alt={pet.name}
          height={100}
          width={1000}
          fallbackSrc="/logo.svg"
          className="h-[220px] w-[440px] rounded-t-lg border object-cover"
        />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {/* <SpeciesTag species={pet.species} /> */}
          <span className="rounded-full bg-gray-200 px-2 py-1 text-sm">
            {/* TODO:pet.location  */}
            📍{"Улаанбаатар"}
          </span>
        </div>
        <p className="text-sm text-gray-600">{pet.behavioralInformation}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full rounded-full py-2" asChild>
          <Link href={`/pets/${pet.id}`}>Үрчлэх</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
