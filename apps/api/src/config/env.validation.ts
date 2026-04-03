export type ApiEnv = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL?: string;
};

export function validateEnv(config: Record<string, unknown>): ApiEnv {
  const nodeEnv = (config.NODE_ENV as string) || 'development';
  const normalizedNodeEnv =
    nodeEnv === 'production' || nodeEnv === 'test' ? nodeEnv : 'development';

  const portRaw = (config.PORT as string) || '3001';
  const port = Number(portRaw);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error('PORT must be a positive number');
  }

  return {
    NODE_ENV: normalizedNodeEnv,
    PORT: port,
    DATABASE_URL: (config.DATABASE_URL as string) || undefined,
  };
}
