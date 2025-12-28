import { PetsQuery } from "customer_api";
import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";
import { filterValidFieldsFromObjectBySchema, removeNullFromObject } from "@/utils";

// import PetsList from "./pets_list";
import { PetListPagination } from "../pets_list_pagination";
import { petsListSPCache, searchParamsCache } from "../search_params";

const MyPetsListPage: React.Page = async (props) => {
  const searchParams = await props.searchParams;
  // searchParamsCache.parse(searchParams);
  // petsListSPCache.parse(searchParams);

  const { order, ...rest } = removeNullFromObject(searchParamsCache.all());

  // Get only filter params (excluding pagination) to detect filter changes
  const filterParams = petsListSPCache.all();

  const _searchParams = {
    ...rest,
    ...order,
  };

  const validQuery = filterValidFieldsFromObjectBySchema(
    PetsQuery.unwrap(),
    _searchParams,
  );

  const response = await client.pets.getAdoptablePetsList({
    query: validQuery,
  });

  const filterKey = JSON.stringify(filterParams);

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
    <div>pets</div>
    // <PetsList
    //   pets={response.body.data}
    //   meta={response.body.meta}
    //   pagination={<PetListPagination meta={response.body.meta} />}
    // />
  );
};

export default MyPetsListPage;
