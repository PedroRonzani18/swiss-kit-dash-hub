import {
  categoryBaseSchema,
  categoryListSchema,
  type CategoryBaseContract,
} from '@swisskit/contracts';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listCategories(): Promise<CategoryBaseContract[]> {
  const data = await apiClient.get<unknown>('/categories');
  return parseApiResponse(categoryListSchema, data);
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CategoryBaseContract> {
  const data = await apiClient.post<unknown, CreateCategoryInput>('/categories', input);
  return parseApiResponse(categoryBaseSchema, data);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryBaseContract> {
  const data = await apiClient.patch<unknown, UpdateCategoryInput>(`/categories/${id}`, input);
  return parseApiResponse(categoryBaseSchema, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/categories/${id}`);
}
