import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountContract,
  CreateAccountContract,
  UpdateAccountContract,
} from '@/modules/finance/contracts';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './repositories/accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  findAll(userId: string): Promise<AccountContract[]> {
    return this.accountsRepository.findAll(userId);
  }

  async findOne(id: string, userId: string): Promise<AccountContract> {
    const account = await this.accountsRepository.findById(id, userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  create(userId: string, input: CreateAccountDto): Promise<AccountContract> {
    const payload: CreateAccountContract = {
      userId,
      name: input.name,
      type: input.type as CreateAccountContract['type'],
      currency: input.currency,
      openingBalanceCents: input.openingBalanceCents,
      institution: input.institution,
    };

    return this.accountsRepository.create(payload);
  }

  async update(
    id: string,
    userId: string,
    input: UpdateAccountDto,
  ): Promise<AccountContract> {
    await this.findOne(id, userId);

    const payload: UpdateAccountContract = {
      name: input.name,
      type: input.type as UpdateAccountContract['type'],
      currency: input.currency,
      openingBalanceCents: input.openingBalanceCents,
      institution: input.institution,
      isArchived: input.isArchived,
    };

    return this.accountsRepository.update(id, userId, payload);
  }

  async remove(id: string, userId: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.accountsRepository.delete(id, userId);

    return { deleted: true };
  }
}
