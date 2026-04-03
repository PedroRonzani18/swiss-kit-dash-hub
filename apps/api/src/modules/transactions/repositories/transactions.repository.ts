import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateTransactionContract,
  TransactionContract,
  UpdateTransactionContract,
} from '@/common/contracts';

const transactionSelect = {
  id: true,
  userId: true,
  accountId: true,
  categoryId: true,
  subcategoryId: true,
  type: true,
  amountCents: true,
  note: true,
  occurredAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TransactionSelect;

type TransactionRow = Prisma.TransactionGetPayload<{
  select: typeof transactionSelect;
}>;

function toTransactionContract(row: TransactionRow): TransactionContract {
  return {
    id: row.id,
    userId: row.userId,
    accountId: row.accountId,
    categoryId: row.categoryId,
    subcategoryId: row.subcategoryId,
    type: row.type,
    amountCents: row.amountCents,
    note: row.note,
    occurredAt: row.occurredAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string): Promise<TransactionContract[]> {
    const records = await this.prisma.transaction.findMany({
      select: transactionSelect,
      where: userId ? { userId } : undefined,
      orderBy: { occurredAt: 'desc' },
    });

    return records.map(toTransactionContract);
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<TransactionContract | null> {
    const record = await this.prisma.transaction.findFirst({
      select: transactionSelect,
      where: userId ? { id, userId } : { id },
    });

    return record ? toTransactionContract(record) : null;
  }

  async create(input: CreateTransactionContract): Promise<TransactionContract> {
    const record = await this.prisma.transaction.create({
      select: transactionSelect,
      data: {
        user: { connect: { id: input.userId } },
        account: { connect: { id: input.accountId } },
        category: { connect: { id: input.categoryId } },
        subcategory:
          input.subcategoryId === undefined || input.subcategoryId === null
            ? undefined
            : {
                connect: { id: input.subcategoryId },
              },
        type: input.type,
        amountCents: input.amountCents,
        note: input.note,
        occurredAt: new Date(input.occurredAt),
      },
    });

    return toTransactionContract(record);
  }

  async update(
    id: string,
    input: UpdateTransactionContract,
  ): Promise<TransactionContract> {
    const hasSubcategoryId = Object.prototype.hasOwnProperty.call(
      input,
      'subcategoryId',
    );

    const subcategoryUpdate = hasSubcategoryId
      ? input.subcategoryId === null
        ? { disconnect: true }
        : input.subcategoryId
          ? {
              connect: { id: input.subcategoryId },
            }
          : undefined
      : undefined;

    const record = await this.prisma.transaction.update({
      select: transactionSelect,
      where: { id },
      data: {
        account: input.accountId
          ? {
              connect: { id: input.accountId },
            }
          : undefined,
        category: input.categoryId
          ? {
              connect: { id: input.categoryId },
            }
          : undefined,
        subcategory: subcategoryUpdate,
        type: input.type,
        amountCents: input.amountCents,
        note: input.note,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : undefined,
      },
    });

    return toTransactionContract(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }
}
