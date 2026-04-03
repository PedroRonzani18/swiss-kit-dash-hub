import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  AccountContract,
  CreateAccountContract,
  UpdateAccountContract,
} from '@/common/contracts';

const accountSelect = {
  id: true,
  userId: true,
  name: true,
  type: true,
  currency: true,
  openingBalanceCents: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AccountSelect;

type AccountRow = Prisma.AccountGetPayload<{ select: typeof accountSelect }>;

function toAccountContract(row: AccountRow): AccountContract {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    type: row.type,
    currency: row.currency,
    openingBalanceCents: row.openingBalanceCents,
    isArchived: row.isArchived,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string): Promise<AccountContract[]> {
    const records = await this.prisma.account.findMany({
      select: accountSelect,
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(toAccountContract);
  }

  async findById(id: string, userId?: string): Promise<AccountContract | null> {
    const record = await this.prisma.account.findFirst({
      select: accountSelect,
      where: userId ? { id, userId } : { id },
    });

    return record ? toAccountContract(record) : null;
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
      },
    });

    return toAccountContract(record);
  }

  async update(id: string, input: UpdateAccountContract): Promise<AccountContract> {
    const record = await this.prisma.account.update({
      select: accountSelect,
      where: { id },
      data: {
        name: input.name,
        type: input.type,
        currency: input.currency,
        openingBalanceCents: input.openingBalanceCents,
        isArchived: input.isArchived,
      },
    });

    return toAccountContract(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.account.delete({ where: { id } });
  }
}
