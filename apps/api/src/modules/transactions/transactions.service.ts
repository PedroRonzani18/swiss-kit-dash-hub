import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './repository/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  findAll() {
    return this.transactionsRepository.findAll();
  }

  async findOne(id: string) {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  create(input: CreateTransactionDto) {
    return this.transactionsRepository.create({
      type: input.type,
      amountCents: input.amountCents,
      note: input.note,
      occurredAt: new Date(input.occurredAt),
      account: {
        connect: {
          id: input.accountId,
        },
      },
      category: {
        connect: {
          id: input.categoryId,
        },
      },
      subcategory: input.subcategoryId
        ? {
            connect: {
              id: input.subcategoryId,
            },
          }
        : undefined,
    });
  }

  async update(id: string, input: UpdateTransactionDto) {
    await this.findOne(id);

    return this.transactionsRepository.update(id, {
      type: input.type,
      amountCents: input.amountCents,
      note: input.note,
      occurredAt: input.occurredAt ? new Date(input.occurredAt) : undefined,
      account: input.accountId
        ? {
            connect: {
              id: input.accountId,
            },
          }
        : undefined,
      category: input.categoryId
        ? {
            connect: {
              id: input.categoryId,
            },
          }
        : undefined,
      subcategory: input.subcategoryId
        ? {
            connect: {
              id: input.subcategoryId,
            },
          }
        : undefined,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.transactionsRepository.delete(id);

    return { deleted: true };
  }
}
