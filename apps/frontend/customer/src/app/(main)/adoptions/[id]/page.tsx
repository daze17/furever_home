import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";

import { AdoptionPostDetails } from "./adoption_post_details";

type Props = {
  id: number;
};

const AdoptionPostDetailPage: React.Page<Props> = async (props) => {
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

  return <AdoptionPostDetails post={response.body} />;
};

export default AdoptionPostDetailPage;
