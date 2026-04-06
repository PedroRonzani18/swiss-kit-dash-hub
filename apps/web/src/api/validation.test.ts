import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { parseApiResponse } from './validation';

describe('parseApiResponse', () => {
  it('returns parsed payload when schema matches', () => {
    const schema = z.object({ id: z.string() });
    const result = parseApiResponse(schema, { id: 'ok' });

    expect(result.id).toBe('ok');
  });

  it('throws when payload does not match schema', () => {
    const schema = z.object({ id: z.string() });
    expect(() => parseApiResponse(schema, { id: 123 })).toThrow('Resposta da API inválida');
  });
});
