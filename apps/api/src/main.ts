import {
  ConsoleLogger,
  LogLevel,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TrimStringsPipe } from './common/pipes/trim-strings.pipe';

const DEFAULT_LOG_LEVELS: LogLevel[] = [
  'log',
  'error',
  'warn',
  'debug',
  'verbose',
];
const PRODUCTION_LOG_LEVELS: LogLevel[] = ['log', 'warn', 'error'];

function parseAllowedOrigins(raw: string): Set<string> {
  const normalizeOrigin = (origin: string) => {
    try {
      return new URL(origin).origin;
    } catch {
      return origin;
    }
  };

  return new Set(
    raw
      .split(',')
      .map((origin) => origin.trim())
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const authCookieName = configService.getOrThrow<string>('AUTH_COOKIE_NAME');
  const corsAllowedOrigins = parseAllowedOrigins(
    configService.getOrThrow<string>('CORS_ALLOWED_ORIGINS'),
  );
  const nodeEnv =
    configService.get<'development' | 'test' | 'production'>('NODE_ENV') ??
    'development';
  const isProduction = nodeEnv === 'production';

  app.useLogger(
    new ConsoleLogger('API', {
      timestamp: true,
      json: isProduction,
      logLevels: isProduction ? PRODUCTION_LOG_LEVELS : DEFAULT_LOG_LEVELS,
    }),
  );
  const requestLogger = new Logger('HttpRequest');

  app.setGlobalPrefix('api');
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(cookieParser());
  app.use((request: Request, response: Response, next: NextFunction) => {
    const startedAt = process.hrtime.bigint();
    const headerRequestId = request.headers['x-request-id'];
    const requestIdFromHeader = Array.isArray(headerRequestId)
      ? headerRequestId[0]
      : headerRequestId;
    const requestId =
      typeof requestIdFromHeader === 'string' && requestIdFromHeader.trim()
        ? requestIdFromHeader
        : randomUUID();

    response.setHeader('x-request-id', requestId);

    response.on('finish', () => {
      const durationMs =
        Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const path = request.originalUrl.split('?')[0];
      const logPayload = JSON.stringify({
        event: 'http.request',
        requestId,
        method: request.method,
        path,
        statusCode: response.statusCode,
        durationMs: Number(durationMs.toFixed(1)),
        userAgent: request.get('user-agent') ?? undefined,
        ip: request.ip,
      });

      if (response.statusCode >= 500) {
        requestLogger.error(logPayload);
        return;
      }

      if (response.statusCode >= 400) {
        requestLogger.warn(logPayload);
        return;
      }

      requestLogger.log(logPayload);
    });

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
    new TrimStringsPipe(),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || corsAllowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin "${origin}" is not allowed by CORS`), false);
    },
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swiss Kit Core API')
    .setDescription(
      'Core API for authentication, health checks, and modular services during finance decommissioning.',
    )
    .setVersion('1.0.0')
    .addCookieAuth(authCookieName, {
      type: 'apiKey',
      in: 'cookie',
      name: authCookieName,
      description: `HttpOnly authentication cookie (${authCookieName})`,
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Legacy Bearer token support for non-browser clients',
      },
      'access-token',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = configService.get<number>('PORT') ?? 3001;
  await app.listen(port);
}

void bootstrap();
