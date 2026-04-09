import {
  categoryBaseSchema,
  categoryListSchema,
} from '@swisskit/contracts';
import type { CategoryBase, CreateCategoryInput, UpdateCategoryInput } from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listCategories(): Promise<CategoryBase[]> {
  const data = await apiClient.get<unknown>('/categories');
  return parseApiResponse(categoryListSchema, data) as CategoryBase[];
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CategoryBase> {
  const data = await apiClient.post<unknown, CreateCategoryInput>('/categories', input);
  return parseApiResponse(categoryBaseSchema, data) as CategoryBase;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryBase> {
  const data = await apiClient.patch<unknown, UpdateCategoryInput>(`/categories/${id}`, input);
  return parseApiResponse(categoryBaseSchema, data) as CategoryBase;
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/categories/${id}`);
}
