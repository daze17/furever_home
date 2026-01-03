import { PetsQuery } from "customer_api";
import Link from "next/link";

import { ErrorCard } from "@/components/error_card";
import { client } from "@/services/client.server";
import {
  filterValidFieldsFromObjectBySchema,
  removeNullFromObject,
} from "@/utils";

import FavoritesList from "./components/favorites_list";
import { FavoritesListPagination } from "./components/favorites_list_pagination";
import { favoritesListSPCache, searchParamsCache } from "./search_params";

const FavoritesPage: React.Page = async (props) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);
  favoritesListSPCache.parse(searchParams);

  const { order, ...rest } = removeNullFromObject(searchParamsCache.all());

  const _searchParams = {
    ...rest,
    ...order,
  };

  const validQuery = filterValidFieldsFromObjectBySchema(
    PetsQuery.unwrap(),
    _searchParams,
  );

  const response = await client.adoptionPosts.getFavoriteAdoptionPostsList({
    query: validQuery,
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
    <FavoritesList
      adoptionPosts={response.body.data}
      meta={response.body.meta}
      pagination={<FavoritesListPagination meta={response.body.meta} />}
    />
  );
};

export default FavoritesPage;
