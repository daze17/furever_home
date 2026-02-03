import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { MyPetDetails } from "./my_pet_details";

type Props = {
  id: number;
};

const MyPetDetailPage: React.Page<Props> = async (props) => {
  const { id } = await props.params;

  const response = await client.pets.getOwnPet({
    params: { id },
  });

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Алдаа"} text={"Алдаа гарлаа"} className="mb-18">
        <Link
          href="/my_pets"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Миний тэжээвэр амьтад руу буцах"}
        </Link>
      </ErrorCard>
    );
  }

  return <MyPetDetails petDetail={response.body} />;
};

export default MyPetDetailPage;
