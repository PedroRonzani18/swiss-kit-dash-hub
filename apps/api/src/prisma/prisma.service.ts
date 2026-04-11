import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function buildAdapterConnectionString(databaseUrl: string): string {
  const parsedDatabaseUrl = new URL(databaseUrl);
  const schema = parsedDatabaseUrl.searchParams.get('schema');

  if (!schema) {
    return parsedDatabaseUrl.toString();
  }

  const currentOptions = parsedDatabaseUrl.searchParams.get('options') ?? '';
  const hasSearchPathOption = /\bsearch_path\s*=/.test(currentOptions);

  if (!hasSearchPathOption) {
    const searchPathOption = `-c search_path=${schema}`;
    const mergedOptions = currentOptions
      ? `${currentOptions} ${searchPathOption}`
      : searchPathOption;

    parsedDatabaseUrl.searchParams.set('options', mergedOptions);
  }

  // "schema" is interpreted by Prisma engines, but PG adapter connections
  // rely on search_path through "options".
  parsedDatabaseUrl.searchParams.delete('schema');

  return parsedDatabaseUrl.toString();
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    super(
      databaseUrl
        ? {
            adapter: new PrismaPg({
              connectionString: buildAdapterConnectionString(databaseUrl),
            }),
          }
        : {},
    );
  }

  async onModuleInit(): Promise<void> {
    if (!this.hasDatabaseUrl) {
      this.logger.warn(
        JSON.stringify({
          event: 'database.connection.disabled',
          reason: 'DATABASE_URL not configured',
        }),
      );
      return;
    }

    await this.$connect();
    this.logger.log(
      JSON.stringify({
        event: 'database.connection.ready',
      }),
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.hasDatabaseUrl) {
      return;
    }

    await this.$disconnect();
    this.logger.log(
      JSON.stringify({
        event: 'database.connection.closed',
      }),
    );
  }
}
