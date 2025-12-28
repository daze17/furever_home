import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import PetDetails from "./pet_details";

type Props = {
  id: number;
};

const PetDetailPage: React.Page<Props> = async (props) => {
  const { id } = await props.params;

  // const currentUserId = session?.sub ?? null;
  const response = await client.pets.getAdoptablePet({
    params: { id },
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

  return <PetDetails petDetail={response.body} />;
};

export default PetDetailPage;
