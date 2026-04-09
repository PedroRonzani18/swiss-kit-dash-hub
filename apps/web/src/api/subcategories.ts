import {
  subcategoryListSchema,
  subcategorySchema,
} from '@swisskit/contracts';
import type {
  CreateSubcategoryInput,
  Subcategory,
  UpdateSubcategoryInput,
} from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listSubcategories(): Promise<Subcategory[]> {
  const data = await apiClient.get<unknown>('/subcategories');
  return parseApiResponse(subcategoryListSchema, data) as Subcategory[];
}

export async function createSubcategory(
  input: CreateSubcategoryInput,
): Promise<Subcategory> {
  const data = await apiClient.post<unknown, CreateSubcategoryInput>('/subcategories', input);
  return parseApiResponse(subcategorySchema, data) as Subcategory;
}

export async function updateSubcategory(
  id: string,
  input: UpdateSubcategoryInput,
): Promise<Subcategory> {
  const data = await apiClient.patch<unknown, UpdateSubcategoryInput>(
    `/subcategories/${id}`,
    input,
  );
  return parseApiResponse(subcategorySchema, data) as Subcategory;
}

export async function deleteSubcategory(id: string): Promise<void> {
  return apiClient.delete(`/subcategories/${id}`);
}
