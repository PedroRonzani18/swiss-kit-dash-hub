import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AccountContract,
  CreateAccountContract,
  UpdateAccountContract,
} from '@/common/contracts';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './repositories/accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  findAll(userId?: string): Promise<AccountContract[]> {
    return this.accountsRepository.findAll(userId);
  }

  async findOne(id: string, userId?: string): Promise<AccountContract> {
    const account = await this.accountsRepository.findById(id, userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  create(input: CreateAccountDto): Promise<AccountContract> {
    const payload: CreateAccountContract = {
      userId: input.userId,
      name: input.name,
      type: input.type,
      currency: input.currency,
      openingBalanceCents: input.openingBalanceCents,
    };

    return this.accountsRepository.create(payload);
  }

  async update(
    id: string,
    input: UpdateAccountDto,
    userId?: string,
  ): Promise<AccountContract> {
    await this.findOne(id, userId);

    const payload: UpdateAccountContract = {
      name: input.name,
      type: input.type,
      currency: input.currency,
      openingBalanceCents: input.openingBalanceCents,
      isArchived: input.isArchived,
    };

    return this.accountsRepository.update(id, payload);
  }

  async remove(id: string, userId?: string): Promise<{ deleted: true }> {
    await this.findOne(id, userId);
    await this.accountsRepository.delete(id);

    return { deleted: true };
  }
}
