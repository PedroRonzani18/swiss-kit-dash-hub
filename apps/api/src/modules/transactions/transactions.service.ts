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

  findAll(userId?: string): Promise<TransactionContract[]> {
    return this.transactionsRepository.findAll(userId);
  }

  async findOne(id: string, userId?: string): Promise<TransactionContract> {
    const transaction = await this.transactionsRepository.findById(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  create(input: CreateTransactionDto): Promise<TransactionContract> {
    const payload: CreateTransactionContract = {
      userId: input.userId,
      type: input.type,
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      occurredAt: input.occurredAt,
      note: input.note,
    };

    return this.transactionsRepository.create(payload);
  }

  async update(
    id: string,
    input: UpdateTransactionDto,
    userId?: string,
  ): Promise<TransactionContract> {
    await this.findOne(id, userId);

    const payload: UpdateTransactionContract = {
      type: input.type,
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      occurredAt: input.occurredAt,
      note: input.note,
    };

    if (Object.prototype.hasOwnProperty.call(input, 'subcategoryId')) {
      payload.subcategoryId = input.subcategoryId ?? null;
    }

    return this.transactionsRepository.update(id, payload);
  }

  async remove(id: string, userId?: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.transactionsRepository.delete(id);

    return { deleted: true };
  }
}
