import { z } from 'zod';

export function parseApiResponse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  payload: unknown,
): z.output<TSchema>;
export function parseApiResponse(
  schema: z.ZodTypeAny,
  payload: unknown,
) {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(`Resposta da API inválida: ${parsed.error.issues[0]?.message ?? 'schema mismatch'}`);
  }

  return parsed.data;
}
