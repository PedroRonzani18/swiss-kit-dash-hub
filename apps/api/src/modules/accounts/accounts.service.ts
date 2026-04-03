import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsRepository } from './repository/accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  findAll() {
    return this.accountsRepository.findAll();
  }

  async findOne(id: string) {
    const account = await this.accountsRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  create(input: CreateAccountDto) {
    return this.accountsRepository.create({
      name: input.name,
      type: input.type,
      currency: input.currency ?? 'BRL',
      balanceCents: input.initialBalanceCents ?? 0,
    });
  }

  async update(id: string, input: UpdateAccountDto) {
    await this.findOne(id);

    return this.accountsRepository.update(id, {
      name: input.name,
      type: input.type,
      currency: input.currency,
      balanceCents: input.initialBalanceCents,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.accountsRepository.delete(id);

    return { deleted: true };
  }
}
