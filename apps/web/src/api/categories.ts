import type {
  CategoryBase,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/finance';
import { apiClient } from './client';

export async function listCategories(): Promise<CategoryBase[]> {
  return apiClient.get<CategoryBase[]>('/categories');
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CategoryBase> {
  return apiClient.post<CategoryBase, CreateCategoryInput>('/categories', input);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<CategoryBase> {
  return apiClient.patch<CategoryBase, UpdateCategoryInput>(`/categories/${id}`, input);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete(`/categories/${id}`);
}
