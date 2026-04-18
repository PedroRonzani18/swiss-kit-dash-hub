import { queryOptions } from "@tanstack/react-query";
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  listCategories as listCategoriesRequest,
  updateCategory as updateCategoryRequest,
} from "@/api/categories";
import { financeQueryKeys } from "./queryKeys";

export const categoriesKeys = {
  all: () => financeQueryKeys.categories(),
};

export type CategoriesApi = {
  list: typeof listCategoriesRequest;
  create: typeof createCategoryRequest;
  update: typeof updateCategoryRequest;
  remove: typeof deleteCategoryRequest;
};

export const categoriesApi: CategoriesApi = {
  list: listCategoriesRequest,
  create: createCategoryRequest,
  update: updateCategoryRequest,
  remove: deleteCategoryRequest,
};

export const categoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: categoriesKeys.all(),
      queryFn: categoriesApi.list,
    }),
};
