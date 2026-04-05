import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AccountContract,
  CreateAccountContract,
  UpdateAccountContract,
} from '@/common/contracts';
import { mapAccountFromPersistence } from '@/common/mappers';

const accountSelect = {
  id: true,
  userId: true,
  name: true,
  type: true,
  currency: true,
  openingBalanceCents: true,
  institution: true,
  isArchived: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AccountSelect;

type AccountRow = Prisma.AccountGetPayload<{ select: typeof accountSelect }>;

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<AccountContract[]> {
    const records = await this.prisma.account.findMany({
      select: accountSelect,
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map(record => mapAccountFromPersistence(record as AccountRow));
  }

  async findById(id: string, userId: string): Promise<AccountContract | null> {
    const record = await this.prisma.account.findUnique({
      select: accountSelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });

    return record ? mapAccountFromPersistence(record as AccountRow) : null;
  }

  async create(input: CreateAccountContract): Promise<AccountContract> {
    const record = await this.prisma.account.create({
      select: accountSelect,
      data: {
        user: { connect: { id: input.userId } },
        name: input.name,
        type: input.type,
        currency: input.currency ?? 'BRL',
        openingBalanceCents: input.openingBalanceCents ?? 0,
        institution: input.institution ?? null,
      },
    });

    return mapAccountFromPersistence(record as AccountRow);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateAccountContract,
  ): Promise<AccountContract> {
    const shouldChangeArchivedAt = input.isArchived !== undefined;

    const record = await this.prisma.account.update({
      select: accountSelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        name: input.name,
        type: input.type,
        currency: input.currency,
        openingBalanceCents: input.openingBalanceCents,
        institution: input.institution,
        isArchived: input.isArchived,
        archivedAt: shouldChangeArchivedAt
          ? input.isArchived
            ? new Date()
            : null
          : undefined,
      },
    });

    return mapAccountFromPersistence(record as AccountRow);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.account.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });
  }
}
