"use client";

import { PlusCircle } from "lucide-react";

import { PetsListResponseBody } from "customer_api";
import Link from "next/link";

import { Button } from "ui";

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
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pets</h1>
          <Button asChild>
            <Link href="/pets/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Pet
            </Link>
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <aside className="flex w-80 shrink-0 flex-col border-r">
          <PetListFilters />
        </aside>

        {/* Right Content - Results */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Pagination */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Results Count */}
              <p className="text-sm text-muted-foreground">
                Showing {pets.length} of {meta.total} pets
              </p>
              {/* Pagination */}
              <div>{pagination}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Pets Grid */}
              {pets.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No pets found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your filters or add a new pet
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Pagination */}
          {/*<div className="border-t bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Showing {pets.length} of {meta.total} pets
              </p>
              <div>{pagination}</div>
            </div>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default PetsList;
