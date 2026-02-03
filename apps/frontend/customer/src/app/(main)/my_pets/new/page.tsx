import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "ui";

import { NewPetForm } from "./new_pet_form";

const NewPetPage: React.Page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/my_pets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Буцах
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Шинэ тэжээвэр амьтан нэмэх
          </h1>
          <NewPetForm />
        </div>
      </div>
    </div>
  );
};

export default NewPetPage;
