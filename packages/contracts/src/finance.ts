import { z } from 'zod';

export const transactionTypeSchema = z.enum(['income', 'expense']);
export const accountTypeSchema = z.enum(['checking', 'savings', 'credit_card', 'cash']);

export const accountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: accountTypeSchema,
  currency: z.string(),
  openingBalanceCents: z.number().int(),
  institution: z.string().nullable(),
  isArchived: z.boolean(),
  archivedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const categoryBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: transactionTypeSchema,
  isArchived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const subcategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  name: z.string(),
  isArchived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const transactionResourceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  accountId: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string().nullable(),
  type: transactionTypeSchema,
  amountCents: z.number().int(),
  note: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const accountListSchema = z.array(accountSchema);
export const categoryListSchema = z.array(categoryBaseSchema);
export const subcategoryListSchema = z.array(subcategorySchema);
export const transactionResourceListSchema = z.array(transactionResourceSchema);

export type AccountContract = z.infer<typeof accountSchema>;
export type CategoryBaseContract = z.infer<typeof categoryBaseSchema>;
export type SubcategoryContract = z.infer<typeof subcategorySchema>;
export type TransactionResourceContract = z.infer<typeof transactionResourceSchema>;
