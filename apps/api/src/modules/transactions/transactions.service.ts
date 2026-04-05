import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTransactionContract,
  TransactionContract,
  UpdateTransactionContract,
} from '@/common/contracts';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './repositories/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  findAll(userId: string): Promise<TransactionContract[]> {
    return this.transactionsRepository.findAll(userId);
  }

  async findOne(id: string, userId: string): Promise<TransactionContract> {
    const transaction = await this.transactionsRepository.findById(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async create(
    userId: string,
    input: CreateTransactionDto,
  ): Promise<TransactionContract> {
    const payload: CreateTransactionContract = {
      userId,
      type: input.type as CreateTransactionContract['type'],
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      occurredAt: input.occurredAt,
      note: input.note,
    };

    await this.transactionsRepository.assertTransactionRelations({
      userId,
      accountId: payload.accountId,
      categoryId: payload.categoryId,
      subcategoryId: payload.subcategoryId,
      currentCategoryId: payload.categoryId,
    });

    return this.transactionsRepository.create(payload);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateTransactionDto,
  ): Promise<TransactionContract> {
    const currentTransaction = await this.findOne(id, userId);

    const payload: UpdateTransactionContract = {
      type: input.type as UpdateTransactionContract['type'],
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      occurredAt: input.occurredAt,
    };

    if (Object.prototype.hasOwnProperty.call(input, 'note')) {
      payload.note = input.note ?? null;
    }

    if (Object.prototype.hasOwnProperty.call(input, 'subcategoryId')) {
      payload.subcategoryId = input.subcategoryId ?? null;
    }

    await this.transactionsRepository.assertTransactionRelations({
      userId,
      accountId: payload.accountId,
      categoryId: payload.categoryId,
      subcategoryId: Object.prototype.hasOwnProperty.call(payload, 'subcategoryId')
        ? payload.subcategoryId
        : undefined,
      currentCategoryId: payload.categoryId ?? currentTransaction.categoryId,
    });

    return this.transactionsRepository.update(id, userId, payload);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.transactionsRepository.delete(id, userId);

    return { deleted: true };
  }
}
