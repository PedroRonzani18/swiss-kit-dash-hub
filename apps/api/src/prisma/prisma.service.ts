import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  constructor() {
    super(
      process.env.DATABASE_URL
        ? {
            adapter: new PrismaPg({
              connectionString: process.env.DATABASE_URL,
            }),
          }
        : {},
    );
  }

  async onModuleInit(): Promise<void> {
    if (!this.hasDatabaseUrl) {
      this.logger.warn(
        'DATABASE_URL not configured. Prisma connection is disabled.',
      );
      return;
    }

    await this.$connect();
    this.logger.log('Prisma connected');
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.hasDatabaseUrl) {
      return;
    }

    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
