import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { TrimStringsPipe } from '@/common/pipes/trim-strings.pipe';
import { PrismaService } from '@/prisma/prisma.service';

export type IntegrationTestApp = {
  app: INestApplication;
  prisma: PrismaService;
};

export async function createIntegrationTestApp(): Promise<IntegrationTestApp> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication({ logger: false });

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

  await app.init();

  return {
    app,
    prisma: app.get(PrismaService),
  };
}
