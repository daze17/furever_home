"use client";

import { PlusCircle } from "lucide-react";

import { PetsListResponseBody } from "customer_api";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { PetCard } from "@/components/pet_card";

const PetsList: React.FC<{
  pets: PetsListResponseBody;
}> = (data) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pets</h1>
        <Button asChild>
          <Link href="/pets/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Pet
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/*<div>
              <label className="mb-2 block text-sm font-medium">
                Search by name
              </label>
              <Input
                placeholder="Search pets..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
*/}
            <div>
              <label className="mb-2 block text-sm font-medium">Species</label>
              {/*<Select
                value={filters.species}
                onValueChange={(value) => handleFilterChange("species", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All species</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>*/}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              {/*<Select
                value={filters.pet_status}
                onValueChange={(value) =>
                  handleFilterChange("pet_status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="adopting">
                    Available for Adoption
                  </SelectItem>
                  <SelectItem value="has_owner">Has Owner</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>*/}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pets Grid */}
      <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

        {/* Pagination */}
      </>
    </div>
  );
};

export default PetsList;
