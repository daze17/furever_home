import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "ui";
import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { MyPetsList } from "./my_pets_list";

const MyPetsListPage: React.Page = async () => {
  const response = await client.pets.getOwnPetsList({
    query: {
      per_page: 0,
    },
  });

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Алдаа"} text={"Алдаа гарлаа"} className="mb-18">
        <Link
          href="/"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Нүүр хуудас руу буцах"}
        </Link>
      </ErrorCard>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Миний тэжээвэр амьтад
            </h1>
            <p className="mt-2 text-gray-600">
              Нийт {response.body.data.length} тэжээвэр амьтан
            </p>
          </div>
          <Button className="bg-[#11D0BC] hover:bg-[#0fb8a6]" asChild>
            <Link href="/my_pets/new">
              <Plus className="mr-2 h-4 w-4" />
              Шинэ тэжээвэр амьтан нэмэх
            </Link>
          </Button>
        </div>

        <MyPetsList pets={response.body.data} />
      </div>
    </div>
  );
};

export default MyPetsListPage;
