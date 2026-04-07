export type ApiEnv = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL?: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  AUTH_COOKIE_NAME: string;
  AUTH_COOKIE_SAME_SITE: 'lax' | 'none' | 'strict';
  WEB_APP_URL: string;
  CORS_ALLOWED_ORIGINS: string;
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

function getCookieSameSite(config: Record<string, unknown>): ApiEnv['AUTH_COOKIE_SAME_SITE'] {
  const rawSameSite = ((config.AUTH_COOKIE_SAME_SITE as string) || 'lax')
    .trim()
    .toLowerCase();

  if (rawSameSite === 'lax' || rawSameSite === 'none' || rawSameSite === 'strict') {
    return rawSameSite;
  }

  throw new Error('AUTH_COOKIE_SAME_SITE must be one of: lax, none, strict');
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

  const webAppUrl =
    (config.WEB_APP_URL as string)?.trim() || 'http://localhost:8080';
  const corsAllowedOrigins =
    (config.CORS_ALLOWED_ORIGINS as string)?.trim() || webAppUrl;
  const authCookieSameSite = getCookieSameSite(config);
  const authCookieSecure = normalizedNodeEnv === 'production' || authCookieSameSite === 'none';

  if (authCookieSameSite === 'none' && !authCookieSecure) {
    throw new Error(
      'Invalid auth cookie configuration: AUTH_COOKIE_SAME_SITE=none requires secure cookies',
    );
  }

  return {
    NODE_ENV: normalizedNodeEnv,
    PORT: port,
    DATABASE_URL: (config.DATABASE_URL as string) || undefined,
    JWT_SECRET: getRequiredString(config, 'JWT_SECRET'),
    JWT_EXPIRES_IN: (config.JWT_EXPIRES_IN as string)?.trim() || '1d',
    AUTH_COOKIE_NAME:
      (config.AUTH_COOKIE_NAME as string)?.trim() || 'swisskit_auth',
    AUTH_COOKIE_SAME_SITE: authCookieSameSite,
    WEB_APP_URL: webAppUrl,
    CORS_ALLOWED_ORIGINS: corsAllowedOrigins,
    GOOGLE_CLIENT_ID: getRequiredString(config, 'GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getRequiredString(config, 'GOOGLE_CLIENT_SECRET'),
    GOOGLE_CALLBACK_URL: getRequiredString(config, 'GOOGLE_CALLBACK_URL'),
  };
}
