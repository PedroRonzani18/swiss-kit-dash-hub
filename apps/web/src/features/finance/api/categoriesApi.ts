import { queryOptions } from "@tanstack/react-query";
import { categoryBaseSchema, categoryListSchema } from "@swisskit/contracts";
import { apiClient } from "@/api/client";
import { parseApiResponse } from "@/api/validation";
import type {
  CategoryBase,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/finance";
import { financeQueryKeys } from "./queryKeys";

export const categoriesKeys = {
  all: () => financeQueryKeys.categories(),
};

async function listCategories(): Promise<CategoryBase[]> {
  const data = await apiClient.get<unknown>("/categories");
  return parseApiResponse(categoryListSchema, data) as CategoryBase[];
}

async function createCategory(input: CreateCategoryInput): Promise<CategoryBase> {
  const data = await apiClient.post<unknown, CreateCategoryInput>(
    "/categories",
    input,
  );
  return parseApiResponse(categoryBaseSchema, data) as CategoryBase;
}

async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryBase> {
  const data = await apiClient.patch<unknown, UpdateCategoryInput>(
    `/categories/${id}`,
    input,
  );
  return parseApiResponse(categoryBaseSchema, data) as CategoryBase;
}

async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/categories/${id}`);
}

export type CategoriesApi = {
  list: typeof listCategories;
  create: typeof createCategory;
  update: typeof updateCategory;
  remove: typeof deleteCategory;
};

export const categoriesApi: CategoriesApi = {
  list: listCategories,
  create: createCategory,
  update: updateCategory,
  remove: deleteCategory,
};

export const categoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: categoriesKeys.all(),
      queryFn: categoriesApi.list,
    }),
};
