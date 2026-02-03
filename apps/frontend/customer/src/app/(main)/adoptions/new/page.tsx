import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "ui";
import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { NewAdoptionPost } from "./new_adoption_post";

const NewAdoptionPostPage: React.Page = async () => {
  // Fetch user's own pets that can be listed for adoption
  const response = await client.pets.getOwnPetsList({
    query: {
      per_page: 0,
    },
  });

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Алдаа"} text={"Алдаа гарлаа"} className="mb-18">
        <Link
          href="/adoptions"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Буцах"}
        </Link>
      </ErrorCard>
    );
  }

  // Filter pets that have 'has_owner' status (not already adopting)
  const availablePets = response.body.data.filter(
    (pet) => pet.pet_status === "has_owner"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/adoptions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Үрчлүүлэх зарууд руу буцах
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Шинэ үрчлүүлэх зар нэмэх
            </h1>
            <p className="mt-2 text-gray-600">
              Тэжээвэр амьтнаа сонгоод үрчлүүлэх зарын мэдээллийг оруулна уу
            </p>
          </div>

          <NewAdoptionPost availablePets={availablePets} />
        </div>
      </div>
    </div>
  );
};

export default NewAdoptionPostPage;
