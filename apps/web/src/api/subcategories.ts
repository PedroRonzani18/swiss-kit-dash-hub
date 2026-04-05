import type {
  CreateSubcategoryInput,
  Subcategory,
  UpdateSubcategoryInput,
} from '@/types/finance';
import { apiClient } from './client';

export async function listSubcategories(): Promise<Subcategory[]> {
  return apiClient.get<Subcategory[]>('/subcategories');
}

export async function createSubcategory(
  input: CreateSubcategoryInput,
): Promise<Subcategory> {
  return apiClient.post<Subcategory, CreateSubcategoryInput>('/subcategories', input);
}

export async function updateSubcategory(
  id: string,
  input: UpdateSubcategoryInput,
): Promise<Subcategory> {
  return apiClient.patch<Subcategory, UpdateSubcategoryInput>(
    `/subcategories/${id}`,
    input,
  );
}

export async function deleteSubcategory(id: string): Promise<void> {
  return apiClient.delete(`/subcategories/${id}`);
}
