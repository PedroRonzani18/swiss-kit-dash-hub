import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createBulk(
    userId: string,
    inputs: CreateTransactionDto[],
  ): Promise<{ count: number }> {
    const payloads: CreateTransactionContract[] = inputs.flatMap((input) =>
      this.expandCreateInput(userId, input),
    );

    return this.transactionsRepository.createMany(userId, payloads);
  }

  async create(
    userId: string,
    input: CreateTransactionDto,
  ): Promise<TransactionContract> {
    const payloads = this.expandCreateInput(userId, input);
    const firstPayload = payloads[0];
    if (!firstPayload) {
      throw new BadRequestException('Transaction payload is empty');
    }

    await this.transactionsRepository.assertTransactionRelations({
      userId,
      accountId: firstPayload.accountId,
      categoryId: firstPayload.categoryId,
      subcategoryId: firstPayload.subcategoryId,
      currentCategoryId: firstPayload.categoryId,
    });

    const createdFirstTransaction =
      await this.transactionsRepository.create(firstPayload);

    if (payloads.length > 1) {
      await this.transactionsRepository.createMany(userId, payloads.slice(1));
    }

    return createdFirstTransaction;
  }

  async update(
    id: string,
    userId: string,
    input: UpdateTransactionDto,
  ): Promise<TransactionContract> {
    const currentTransaction = await this.findOne(id, userId);
    const hasSubcategoryId = input.subcategoryId !== undefined;
    const hasNote = input.note !== undefined;

    const payload: UpdateTransactionContract = {
      type: input.type as UpdateTransactionContract['type'],
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      occurredAt: input.occurredAt,
    };

    if (hasNote) {
      payload.note = input.note ?? null;
    }

    if (hasSubcategoryId) {
      payload.subcategoryId = input.subcategoryId ?? null;
    }

    await this.transactionsRepository.assertTransactionRelations({
      userId,
      accountId: payload.accountId,
      categoryId: payload.categoryId,
      subcategoryId: hasSubcategoryId
        ? payload.subcategoryId
        : (currentTransaction.subcategoryId ?? undefined),
      currentCategoryId: payload.categoryId ?? currentTransaction.categoryId,
    });

    return this.transactionsRepository.update(id, userId, payload);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.transactionsRepository.delete(id, userId);

    return { deleted: true };
  }

  private expandCreateInput(
    userId: string,
    input: CreateTransactionDto,
  ): CreateTransactionContract[] {
    const basePayload: CreateTransactionContract = {
      userId,
      type: input.type as CreateTransactionContract['type'],
      amountCents: input.amountCents,
      accountId: input.accountId,
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      occurredAt: input.occurredAt,
      note: input.note,
    };

    if (!input.installmentEnabled) {
      return [
        {
          ...basePayload,
          isInstallment: false,
          installmentNumber: null,
          installmentTotal: null,
          installmentGroupId: null,
        },
      ];
    }

    const installmentCount = input.installmentCount;
    if (!installmentCount || installmentCount < 2) {
      throw new BadRequestException(
        'installmentCount must be at least 2 when installmentEnabled is true',
      );
    }

    const installmentAmounts = this.splitInstallmentAmounts(
      basePayload.amountCents,
      installmentCount,
    );
    const baseOccurredAtDate = new Date(basePayload.occurredAt);
    const baseDayOfMonth = baseOccurredAtDate.getUTCDate();
    const installmentGroupId = randomUUID();
    const baseNote = (basePayload.note ?? '').trim();

    return installmentAmounts.map((amountCents, index) => ({
      ...basePayload,
      amountCents,
      note: baseNote
        ? `${baseNote} (${index + 1}/${installmentCount})`
        : `(${index + 1}/${installmentCount})`,
      occurredAt: this.addMonthsClampedToDay(
        baseOccurredAtDate,
        baseDayOfMonth,
        index,
      ),
      isInstallment: true,
      installmentNumber: index + 1,
      installmentTotal: installmentCount,
      installmentGroupId,
    }));
  }

  private splitInstallmentAmounts(
    totalAmountCents: number,
    installmentCount: number,
  ): number[] {
    const baseAmount = Math.floor(totalAmountCents / installmentCount);
    const remainder = totalAmountCents % installmentCount;
    const amounts = Array.from(
      { length: installmentCount },
      (_, index) => baseAmount + (index < remainder ? 1 : 0),
    );

    if (amounts.some((amount) => amount <= 0)) {
      throw new BadRequestException(
        'installmentCount is too high for the provided amount',
      );
    }

    return amounts;
  }

  private addMonthsClampedToDay(
    baseDate: Date,
    targetDay: number,
    monthsToAdd: number,
  ): string {
    const absoluteMonth = baseDate.getUTCMonth() + monthsToAdd;
    const year = baseDate.getUTCFullYear() + Math.floor(absoluteMonth / 12);
    const month = ((absoluteMonth % 12) + 12) % 12;
    const lastDayOfTargetMonth = new Date(
      Date.UTC(year, month + 1, 0, 12, 0, 0, 0),
    ).getUTCDate();
    const resolvedDay = Math.min(targetDay, lastDayOfTargetMonth);

    return new Date(
      Date.UTC(year, month, resolvedDay, 12, 0, 0, 0),
    ).toISOString();
  }
}
