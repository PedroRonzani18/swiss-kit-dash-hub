import {
  subcategoryListSchema,
  subcategorySchema,
  type SubcategoryContract,
} from '@swisskit/contracts';
import type {
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from '@/types/finance';
import { apiClient } from './client';
import { parseApiResponse } from './validation';

export async function listSubcategories(): Promise<SubcategoryContract[]> {
  const data = await apiClient.get<unknown>('/subcategories');
  return parseApiResponse(subcategoryListSchema, data);
}

export async function createSubcategory(
  input: CreateSubcategoryInput,
): Promise<SubcategoryContract> {
  const data = await apiClient.post<unknown, CreateSubcategoryInput>('/subcategories', input);
  return parseApiResponse(subcategorySchema, data);
}

export async function updateSubcategory(
  id: string,
  input: UpdateSubcategoryInput,
): Promise<SubcategoryContract> {
  const data = await apiClient.patch<unknown, UpdateSubcategoryInput>(
    `/subcategories/${id}`,
    input,
  );
  return parseApiResponse(subcategorySchema, data);
}

export async function deleteSubcategory(id: string): Promise<void> {
  return apiClient.delete(`/subcategories/${id}`);
}
