"use client";

import { AlertTriangle, Settings } from "lucide-react";

import { PetResponseBody } from "customer_api";
import Link from "next/link";

import { hasUpcomingVaccinations } from "@/utils/vaccination";

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

export const MyPetCard: React.FC<{
  pet: PetResponseBody;
}> = ({ pet }) => {
  const vaccinationWarning = pet.pet_medical_records?.vaccinations
    ? hasUpcomingVaccinations(pet.pet_medical_records.vaccinations)
    : false;

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

  const statusLabel = {
    adopting: "Үрчлүүлэх",
    has_owner: "Эзэнтэй",
    inactive: "Идэвхгүй",
  };

  return (
    <Card className={`group flex h-full flex-col overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#11D0BC] hover:shadow-lg ${vaccinationWarning ? "border-amber-400 bg-amber-50" : ""}`}>
      <CardHeader className="overflow-hidden p-0">
        <ImageWithFallback
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
          <span className="truncate" title={pet.name}>
            {pet.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              pet.pet_status === "adopting"
                ? "bg-green-100 text-green-700"
                : pet.pet_status === "has_owner"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {statusLabel[pet.pet_status]}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-500">
          {`${petAge} настай`}
          {vaccinationWarning && (
            <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              Вакцины сануулга
            </span>
          )}
        </CardDescription>
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
        {pet.notes && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-500">{pet.notes}</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t bg-gray-50/50 pt-3">
        <Button
          className="w-full rounded-full bg-[#11D0BC] py-2 transition-colors hover:bg-[#0fb8a6]"
          asChild
        >
          <Link href={`/my_pets/${pet.id}`}>
            <Settings className="mr-2 h-4 w-4" />
            Удирдах
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
