import { queryOptions } from "@tanstack/react-query";
import {
  createSubcategory as createSubcategoryRequest,
  deleteSubcategory as deleteSubcategoryRequest,
  listSubcategories as listSubcategoriesRequest,
  updateSubcategory as updateSubcategoryRequest,
} from "@/api/subcategories";
import { financeQueryKeys } from "./queryKeys";

export const subcategoriesKeys = {
  all: () => financeQueryKeys.subcategories(),
};

export type SubcategoriesApi = {
  list: typeof listSubcategoriesRequest;
  create: typeof createSubcategoryRequest;
  update: typeof updateSubcategoryRequest;
  remove: typeof deleteSubcategoryRequest;
};

export const subcategoriesApi: SubcategoriesApi = {
  list: listSubcategoriesRequest,
  create: createSubcategoryRequest,
  update: updateSubcategoryRequest,
  remove: deleteSubcategoryRequest,
};

export const subcategoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: subcategoriesKeys.all(),
      queryFn: subcategoriesApi.list,
    }),
};
