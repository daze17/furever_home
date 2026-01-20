import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "ui";
import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { EditAdoptionPost } from "./edit_adoption_post";

type Props = {
  id: number;
};

const EditAdoptionPostPage: React.Page<Props> = async (props) => {
  const { id } = await props.params;
  const response = await client.adoptionPosts.getOwnAdoptionPost({
    params: { id },
  });

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Алдаа"} text={"Зар олдсонгүй"} className="mb-18">
        <Link
          href="/adoptions"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Буцах"}
        </Link>
      </ErrorCard>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/adoptions/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Зарын дэлгэрэнгүй рүү буцах
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Үрчлүүлэх зар засах
            </h1>
            <p className="mt-2 text-gray-600">
              {response.body.pet.name}-н үрчлүүлэх зарын мэдээллийг засна уу
            </p>
          </div>

          <EditAdoptionPost post={response.body} />
        </div>
      </div>
    </div>
  );
};

export default EditAdoptionPostPage;
