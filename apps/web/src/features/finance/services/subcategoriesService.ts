import { queryOptions } from '@tanstack/react-query';
import {
  createSubcategory as createSubcategoryRequest,
  deleteSubcategory as deleteSubcategoryRequest,
  listSubcategories as listSubcategoriesRequest,
  updateSubcategory as updateSubcategoryRequest,
} from '@/api/subcategories';
import { financeKeys } from '@/api/queryKeys';

export const subcategoriesKeys = {
  all: () => financeKeys.subcategories(),
};

export const subcategoriesService = {
  list: listSubcategoriesRequest,
  create: createSubcategoryRequest,
  update: updateSubcategoryRequest,
  remove: deleteSubcategoryRequest,
};

export const subcategoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: subcategoriesKeys.all(),
      queryFn: subcategoriesService.list,
    }),
};
