"use client";

import { PaginationMeta } from "customer_api";
import { useQueryStates } from "nuqs";

import { CustomPagination } from "@/components/custom_pagination";

import { paginationParsers } from "./search_params";

type Props = {
  meta: PaginationMeta;
};
export const PetListPagination: React.FC<Props> = ({ meta }) => {
  const [, setPagination] = useQueryStates(paginationParsers);
  return (
    <CustomPagination
      meta={meta}
      setPage={(page) => {
        setPagination({ page: page });
      }}
    />
  );
};
