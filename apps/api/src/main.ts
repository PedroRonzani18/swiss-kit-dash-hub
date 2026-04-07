import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TrimStringsPipe } from './common/pipes/trim-strings.pipe';

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
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const authCookieName = configService.getOrThrow<string>('AUTH_COOKIE_NAME');
  const corsAllowedOrigins = parseAllowedOrigins(
    configService.getOrThrow<string>('CORS_ALLOWED_ORIGINS'),
  );

  app.setGlobalPrefix('api');
  app.use(cookieParser());

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
    .setTitle('SwissKit Finance API')
    .setDescription('Backend foundation for personal finance app')
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
