"use client";

import { useEffect, useState } from "react";
import { PetResponseBody } from "customer_api";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle } from "ui";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { client } from "@/services/client";
import ImageWithFallback from "@/components/image_with_fallback";

interface PetDetailsProps {
  id: string;
}

export function PetDetails({ id }: PetDetailsProps) {
  const router = useRouter();
  const [pet, setPet] = useState<PetResponseBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await client.pets.getPet({
        params: { id: Number(id) },
      });

      if (response.status === 200) {
        setPet(response.body);
      } else if (response.status === 404) {
        setError("Pet not found");
      } else {
        setError("Failed to fetch pet details");
      }
    } catch (err) {
      setError("An error occurred while fetching pet details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    setDeleting(true);

    try {
      const response = await client.pets.deletePet({
        params: { id: Number(id) },
        body: {},
      });

      if (response.status === 204) {
        router.push("/pets");
      } else {
        setError("Failed to delete pet");
      }
    } catch (err) {
      setError("An error occurred while deleting pet");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <p className="text-gray-500">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error || "Pet not found"}
        </div>
        <Button asChild className="mt-4">
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Link>
        </Button>
      </div>
    );
  }

  const petAge = pet.birth_date
    ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear()
    : null;

  const speciesEmoji = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    other: "🐾",
  };

  const statusLabel = {
    adopting: "Available for Adoption",
    has_owner: "Has Owner",
    inactive: "Inactive",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/pets/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pet Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageWithFallback
              src={pet.pet_image_url || ""}
              alt={pet.name}
              height={400}
              width={600}
              fallbackSrc="/logo.svg"
              className="h-[400px] w-full rounded-lg border object-cover"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Species</p>
                  <p className="mt-1 text-lg">
                    {speciesEmoji[pet.species]} {pet.species}
                  </p>
                </div>

                {petAge !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p className="mt-1 text-lg">{petAge} years old</p>
                  </div>
                )}

                {pet.size && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Size</p>
                    <p className="mt-1 text-lg capitalize">{pet.size}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-lg">{statusLabel[pet.pet_status]}</p>
                </div>
              </div>

              {pet.birth_date && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Birth Date</p>
                  <p className="mt-1">
                    {new Date(pet.birth_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {pet.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="mt-1 text-gray-700">{pet.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pet ID:</span>
                <span className="text-sm font-medium">{pet.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm font-medium">
                  {new Date(pet.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm font-medium">
                  {new Date(pet.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
