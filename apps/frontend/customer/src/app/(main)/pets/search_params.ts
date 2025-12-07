import { PetsQuery } from "customer_api";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsString,
} from "nuqs/server";
import z from "zod";

const orderSchema = z.object({
  sorting_field: PetsQuery.unwrap().shape.sorting_field.unwrap().nullable(),
  sorting_order: PetsQuery.unwrap().shape.sorting_order.unwrap().nullable(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

export const petsListSPParsers = {
  // Basic filters
  name: parseAsString.withOptions({ shallow: false }),
  species: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
  size: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
  pet_status: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),

  // Behavioral filters
  energy_level: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
  friendliness_with_children: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),
  friendliness_with_pets: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),
  is_house_trained: parseAsString.withOptions({ shallow: false }),
  training_level: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),

  // Age range (dates)
  birth_date_from: parseAsString.withOptions({ shallow: false }),
  birth_date_to: parseAsString.withOptions({ shallow: false }),
};

export const paginationParsers = {
  page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  order: parseAsJson(orderSchema.parse).withOptions({ shallow: false }),
  current_page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  per_page: parseAsInteger.withDefault(20),
};

export const petsListSPCache = createSearchParamsCache(petsListSPParsers);

export const paginationSPCache = createSearchParamsCache(paginationParsers);

export const searchParamsCache = createSearchParamsCache({
  ...paginationParsers,
  ...petsListSPParsers,
});
