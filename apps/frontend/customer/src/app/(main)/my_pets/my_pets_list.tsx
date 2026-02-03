"use client";

import { PetsListResponseBody } from "customer_api";

import { MyPetCard } from "@/components/my_pet_card";

export const MyPetsList: React.FC<{
  pets: PetsListResponseBody;
}> = ({ pets }) => {
  if (pets.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <span className="text-3xl">🐾</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Тэжээвэр амьтан олдсонгүй
          </h3>
          <p className="mt-2 text-gray-500">
            Шинэ тэжээвэр амьтан нэмнэ үү
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {pets.map((pet) => (
        <MyPetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};
