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

export const categorySchema = z.object({
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
  isInstallment: z.boolean(),
  installmentNumber: z.number().int().nullable(),
  installmentTotal: z.number().int().nullable(),
  installmentGroupId: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAccountInputSchema = z.object({
  name: z.string(),
  type: accountTypeSchema,
  currency: z.string().optional(),
  openingBalanceCents: z.number().int().nonnegative().optional(),
  institution: z.string().optional(),
});

export const updateAccountInputSchema = createAccountInputSchema
  .partial()
  .extend({
    institution: z.string().nullable().optional(),
    isArchived: z.boolean().optional(),
  });

export const createCategoryInputSchema = z.object({
  name: z.string(),
  type: transactionTypeSchema,
});

export const updateCategoryInputSchema = createCategoryInputSchema
  .partial()
  .extend({
    isArchived: z.boolean().optional(),
  });

export const createSubcategoryInputSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
});

export const updateSubcategoryInputSchema = createSubcategoryInputSchema
  .partial()
  .extend({
    isArchived: z.boolean().optional(),
  });

const createTransactionInputBaseSchema = z.object({
  type: transactionTypeSchema,
  amountCents: z.number().int().positive(),
  accountId: z.string(),
  categoryId: z.string(),
  subcategoryId: z.string().nullable().optional(),
  occurredAt: z.string(),
  note: z.string().optional(),
  installmentEnabled: z.boolean().optional(),
  installmentCount: z.number().int().min(2).optional(),
});

export const createTransactionInputSchema = createTransactionInputBaseSchema.superRefine((input, context) => {
  if (input.installmentEnabled && !input.installmentCount) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'installmentCount is required when installmentEnabled is true',
      path: ['installmentCount'],
    });
  }
});

export const updateTransactionInputSchema = createTransactionInputBaseSchema
  .partial()
  .extend({
    note: z.string().nullable().optional(),
  });

export const createTransactionBulkInputSchema = z
  .array(createTransactionInputSchema)
  .min(1);

export const accountListSchema = z.array(accountSchema);
export const categoryListSchema = z.array(categorySchema);
export const subcategoryListSchema = z.array(subcategorySchema);
export const transactionResourceListSchema = z.array(transactionResourceSchema);

export type AccountContract = z.infer<typeof accountSchema>;
export type CategoryContract = z.infer<typeof categorySchema>;
export type SubcategoryContract = z.infer<typeof subcategorySchema>;
export type TransactionContract = z.infer<typeof transactionResourceSchema>;

export type CreateAccountInputContract = z.infer<typeof createAccountInputSchema>;
export type UpdateAccountInputContract = z.infer<typeof updateAccountInputSchema>;
export type CreateCategoryInputContract = z.infer<typeof createCategoryInputSchema>;
export type UpdateCategoryInputContract = z.infer<typeof updateCategoryInputSchema>;
export type CreateSubcategoryInputContract = z.infer<typeof createSubcategoryInputSchema>;
export type UpdateSubcategoryInputContract = z.infer<typeof updateSubcategoryInputSchema>;
export type CreateTransactionInputContract = z.infer<typeof createTransactionInputSchema>;
export type UpdateTransactionInputContract = z.infer<typeof updateTransactionInputSchema>;
export type CreateTransactionBulkInputContract = z.infer<typeof createTransactionBulkInputSchema>;

// Backwards-compatible aliases
export const categoryBaseSchema = categorySchema;
export type CategoryBaseContract = CategoryContract;
export const transactionSchema = transactionResourceSchema;
export type TransactionResourceContract = z.infer<typeof transactionResourceSchema>;
