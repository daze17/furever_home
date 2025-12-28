"use client";

import { PetsListResponseBody } from "customer_api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { PetCard } from "@/components/pet_card";

import { PetListFilters } from "./components/pet_list_filters";

type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
};

const PetsList: React.FC<{
  pets: PetsListResponseBody;
  meta: PaginationMeta;
  pagination: React.ReactNode;
}> = ({ pets, meta, pagination }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-80 shrink-0 border-r bg-white shadow-sm">
          <PetListFilters />
        </aside>

        <div className="flex-1">
          <div className="sticky top-0 z-10 h-16 border-b bg-white px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {pets.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {meta.total}
                </span>{" "}
                pets
              </p>
              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-44 border-gray-200 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name_asc">Name A-Z</SelectItem>
                    <SelectItem value="name_desc">Name Z-A</SelectItem>
                  </SelectContent>
                </Select>
                {pagination}
              </div>
            </div>
          </div>

          <div className="p-6">
            {pets.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">🐾</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No pets found
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or add a new pet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsList;
