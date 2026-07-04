import { z } from 'zod';

export const AllowedEmailSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  note: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const AllowedEmailsOverviewSchema = z.object({
  module: z.literal('allowed-emails'),
  status: z.literal('available'),
  allowedEmails: z.array(AllowedEmailSchema),
});

export const CreateAllowedEmailInputSchema = z.object({
  email: z.string().email(),
  note: z.string().nullable().optional(),
});

export const UpdateAllowedEmailStatusInputSchema = z.object({
  isActive: z.boolean(),
});

export type AllowedEmailContract = z.infer<typeof AllowedEmailSchema>;
export type AllowedEmailsOverviewContract = z.infer<
  typeof AllowedEmailsOverviewSchema
>;
export type CreateAllowedEmailInputContract = z.infer<
  typeof CreateAllowedEmailInputSchema
>;
export type UpdateAllowedEmailStatusInputContract = z.infer<
  typeof UpdateAllowedEmailStatusInputSchema
>;
