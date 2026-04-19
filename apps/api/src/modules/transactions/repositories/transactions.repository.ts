import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateTransactionContract,
  TransactionContract,
  UpdateTransactionContract,
} from '@/common/contracts';
import { mapTransactionFromPersistence } from '@/common/mappers';

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

type AssertTransactionRelationsInput = {
  userId: string;
  accountId?: string;
  categoryId?: string;
  subcategoryId?: string | null;
  currentCategoryId?: string;
};

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<TransactionContract[]> {
    const records = await this.prisma.transaction.findMany({
      select: transactionSelect,
      where: { userId },
      orderBy: { occurredAt: 'desc' },
    });

    return records.map((record) =>
      mapTransactionFromPersistence(record as TransactionRow),
    );
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<TransactionContract | null> {
    const record = await this.prisma.transaction.findUnique({
      select: transactionSelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });

    return record
      ? mapTransactionFromPersistence(record as TransactionRow)
      : null;
  }

  async assertTransactionRelations(
    input: AssertTransactionRelationsInput,
  ): Promise<void> {
    if (input.accountId) {
      const account = await this.prisma.account.findUnique({
        where: {
          id_userId: {
            id: input.accountId,
            userId: input.userId,
          },
        },
        select: { id: true },
      });
      if (!account) {
        throw new NotFoundException('Account not found for authenticated user');
      }
    }

    if (input.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id_userId: {
            id: input.categoryId,
            userId: input.userId,
          },
        },
        select: { id: true },
      });
      if (!category) {
        throw new NotFoundException(
          'Category not found for authenticated user',
        );
      }
    }

    if (input.subcategoryId === undefined || input.subcategoryId === null) {
      return;
    }

    const effectiveCategoryId = input.categoryId ?? input.currentCategoryId;
    const subcategory = await this.prisma.subcategory.findFirst({
      where: {
        id: input.subcategoryId,
        userId: input.userId,
        categoryId: effectiveCategoryId,
      },
      select: { id: true },
    });

    if (!subcategory) {
      throw new NotFoundException(
        'Subcategory not found for authenticated user and category',
      );
    }
  }

  async createMany(
    userId: string,
    inputs: CreateTransactionContract[],
  ): Promise<{ count: number }> {
    const accountIds = [...new Set(inputs.map((i) => i.accountId))];
    const categoryIds = [...new Set(inputs.map((i) => i.categoryId))];
    const subcategoryIds = [
      ...new Set(
        inputs
          .map((i) => i.subcategoryId)
          .filter((id): id is string => !!id),
      ),
    ];

    const [accounts, categories] = await Promise.all([
      this.prisma.account.findMany({
        where: { userId, id: { in: accountIds } },
        select: { id: true },
      }),
      this.prisma.category.findMany({
        where: { userId, id: { in: categoryIds } },
        select: { id: true },
      }),
    ]);

    if (accounts.length !== accountIds.length) {
      throw new NotFoundException(
        'One or more accounts not found for authenticated user',
      );
    }
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException(
        'One or more categories not found for authenticated user',
      );
    }

    if (subcategoryIds.length > 0) {
      const subcategories = await this.prisma.subcategory.findMany({
        where: { userId, id: { in: subcategoryIds } },
        select: { id: true, categoryId: true },
      });
      const subcategoryMap = new Map(
        subcategories.map((s) => [s.id, s.categoryId]),
      );
      for (const input of inputs) {
        if (input.subcategoryId) {
          const parentCategoryId = subcategoryMap.get(input.subcategoryId);
          if (!parentCategoryId || parentCategoryId !== input.categoryId) {
            throw new NotFoundException(
              'One or more subcategories not found for authenticated user and category',
            );
          }
        }
      }
    }

    return this.prisma.transaction.createMany({
      data: inputs.map((input) => ({
        userId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId ?? null,
        type: input.type,
        amountCents: input.amountCents,
        note: input.note ?? null,
        occurredAt: new Date(input.occurredAt),
      })),
    });
  }

  async create(input: CreateTransactionContract): Promise<TransactionContract> {
    const record = await this.prisma.transaction.create({
      select: transactionSelect,
      data: {
        user: { connect: { id: input.userId } },
        account: {
          connect: {
            id_userId: {
              id: input.accountId,
              userId: input.userId,
            },
          },
        },
        category: {
          connect: {
            id_userId: {
              id: input.categoryId,
              userId: input.userId,
            },
          },
        },
        subcategory:
          input.subcategoryId === undefined || input.subcategoryId === null
            ? undefined
            : {
                connect: { id: input.subcategoryId },
              },
        type: input.type,
        amountCents: input.amountCents,
        note: input.note ?? null,
        occurredAt: new Date(input.occurredAt),
      },
    });

    return mapTransactionFromPersistence(record as TransactionRow);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateTransactionContract,
  ): Promise<TransactionContract> {
    const hasSubcategoryId = Object.prototype.hasOwnProperty.call(
      input,
      'subcategoryId',
    );
    const hasNote = Object.prototype.hasOwnProperty.call(input, 'note');

    const record = await this.prisma.transaction.update({
      select: transactionSelect,
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        account: input.accountId
          ? {
              connect: {
                id_userId: {
                  id: input.accountId,
                  userId,
                },
              },
            }
          : undefined,
        category: input.categoryId
          ? {
              connect: {
                id_userId: {
                  id: input.categoryId,
                  userId,
                },
              },
            }
          : undefined,
        subcategory: hasSubcategoryId
          ? input.subcategoryId === null
            ? { disconnect: true }
            : input.subcategoryId
              ? { connect: { id: input.subcategoryId } }
              : undefined
          : undefined,
        type: input.type,
        amountCents: input.amountCents,
        note: hasNote ? (input.note ?? null) : undefined,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : undefined,
      },
    });

    return mapTransactionFromPersistence(record as TransactionRow);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });
  }
}
