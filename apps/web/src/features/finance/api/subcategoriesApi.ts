import { queryOptions } from "@tanstack/react-query";
import { subcategoryListSchema, subcategorySchema } from "@swisskit/contracts";
import { apiClient } from "@/api/client";
import { parseApiResponse } from "@/api/validation";
import type {
  CreateSubcategoryInput,
  Subcategory,
  UpdateSubcategoryInput,
} from "@/types/finance";
import { financeQueryKeys } from "./queryKeys";

export const subcategoriesKeys = {
  all: () => financeQueryKeys.subcategories(),
};

async function listSubcategories(): Promise<Subcategory[]> {
  const data = await apiClient.get<unknown>("/subcategories");
  return parseApiResponse(subcategoryListSchema, data) as Subcategory[];
}

async function createSubcategory(
  input: CreateSubcategoryInput,
): Promise<Subcategory> {
  const data = await apiClient.post<unknown, CreateSubcategoryInput>(
    "/subcategories",
    input,
  );
  return parseApiResponse(subcategorySchema, data) as Subcategory;
}

async function updateSubcategory(
  id: string,
  input: UpdateSubcategoryInput,
): Promise<Subcategory> {
  const data = await apiClient.patch<unknown, UpdateSubcategoryInput>(
    `/subcategories/${id}`,
    input,
  );
  return parseApiResponse(subcategorySchema, data) as Subcategory;
}

async function deleteSubcategory(id: string): Promise<void> {
  return apiClient.delete(`/subcategories/${id}`);
}

export type SubcategoriesApi = {
  list: typeof listSubcategories;
  create: typeof createSubcategory;
  update: typeof updateSubcategory;
  remove: typeof deleteSubcategory;
};

export const subcategoriesApi: SubcategoriesApi = {
  list: listSubcategories,
  create: createSubcategory,
  update: updateSubcategory,
  remove: deleteSubcategory,
};

export const subcategoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: subcategoriesKeys.all(),
      queryFn: subcategoriesApi.list,
    }),
};
