export type ApiEnv = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
};

function getRequiredString(
  config: Record<string, unknown>,
  key: keyof ApiEnv,
): string {
  const value = config[key] as string | undefined;
  if (!value || !value.trim()) {
    throw new Error(`${key} is required`);
  }

  return value.trim();
}

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
    JWT_SECRET: getRequiredString(config, 'JWT_SECRET'),
    JWT_EXPIRES_IN: (config.JWT_EXPIRES_IN as string)?.trim() || '1d',
    GOOGLE_CLIENT_ID: getRequiredString(config, 'GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getRequiredString(config, 'GOOGLE_CLIENT_SECRET'),
    GOOGLE_CALLBACK_URL: getRequiredString(config, 'GOOGLE_CALLBACK_URL'),
  };
}
