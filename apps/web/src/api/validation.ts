import { z } from 'zod';

export function parseApiResponse<T>(schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(`Resposta da API inválida: ${parsed.error.issues[0]?.message ?? 'schema mismatch'}`);
  }

  return parsed.data;
}
