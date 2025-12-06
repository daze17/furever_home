import { PetsQuery } from "customer_api";
import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";
import { filterValidFieldsFromObjectBySchema } from "@/utils/filter_valid_fields_from_object_by_schema";
import { removeNullFromObject } from "@/utils/remove_null_and_undefined";

import PetsList from "./pets_list";
import { PetListPagination } from "./pets_list_pagination";
import { petsListSPCache, searchParamsCache } from "./search_params";

const ProfilePage: React.Page = async (props) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  petsListSPCache.parse(searchParams);

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

  const response = await client.pets.getPetsList({
    query: validQuery,
  });

  const filterKey = JSON.stringify(filterParams);

  if (response.status !== 200) {
    return (
      <ErrorCard title={"Error"} text={"Some error occured"} className="mb-18">
        <Link
          href="/"
          className="rounded-sm border border-secondary px-6 py-3 text-secondary"
        >
          {"Back to homepage"}
        </Link>
      </ErrorCard>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PetsList pets={response.body.data} />
      <div className="self-center">
        <PetListPagination meta={response.body.meta} />
      </div>
    </div>
  );
};

export default ProfilePage;
