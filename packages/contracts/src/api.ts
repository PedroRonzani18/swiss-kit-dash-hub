import { z } from 'zod';

export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  requestId: z.string().optional(),
  path: z.string().optional(),
  timestamp: z.string().optional(),
});

export const ApiStatusSchema = z.enum(['available', 'unavailable', 'degraded']);

export const PaginationInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const createPaginatedResponseSchema = <ItemSchema extends z.ZodTypeAny>(
  itemSchema: ItemSchema,
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationMetaSchema,
  });

export type ApiErrorContract = z.infer<typeof ApiErrorSchema>;
export type ApiStatusContract = z.infer<typeof ApiStatusSchema>;
export type PaginationInputContract = z.input<typeof PaginationInputSchema>;
export type PaginationMetaContract = z.infer<typeof PaginationMetaSchema>;
export type PaginatedResponseContract<TItem> = {
  items: TItem[];
  pagination: PaginationMetaContract;
};
