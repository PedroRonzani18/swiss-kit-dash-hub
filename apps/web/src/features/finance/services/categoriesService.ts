import { queryOptions } from '@tanstack/react-query';
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  listCategories as listCategoriesRequest,
  updateCategory as updateCategoryRequest,
} from '@/api/categories';
import { financeKeys } from '@/api/queryKeys';

export const categoriesKeys = {
  all: () => financeKeys.categories(),
};

export const categoriesService = {
  list: listCategoriesRequest,
  create: createCategoryRequest,
  update: updateCategoryRequest,
  remove: deleteCategoryRequest,
};

export const categoriesQueries = {
  list: () =>
    queryOptions({
      queryKey: categoriesKeys.all(),
      queryFn: categoriesService.list,
    }),
};
