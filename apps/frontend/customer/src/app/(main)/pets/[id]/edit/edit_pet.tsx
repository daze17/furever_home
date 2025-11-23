"use client";

import { useEffect, useState } from "react";
import { PetResponseBody } from "customer_api";
import { Card, CardContent, CardHeader, CardTitle, Button } from "ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { client } from "@/services/client";
import { PetForm } from "../../components/pet_form";

interface EditPetProps {
  id: string;
}

export function EditPet({ id }: EditPetProps) {
  const [pet, setPet] = useState<PetResponseBody | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/pets/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pet Details
          </Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Pet: {pet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <PetForm mode="edit" pet={pet} />
        </CardContent>
      </Card>
    </div>
  );
}
