import { Injectable } from '@nestjs/common';
import {
  CreateAllowedEmailInputSchema,
  UpdateAllowedEmailStatusInputSchema,
  type AllowedEmailContract,
  type AllowedEmailsOverviewContract,
  type CreateAllowedEmailInputContract,
  type UpdateAllowedEmailStatusInputContract,
} from '@swisskit/contracts/allowed-emails';
import { AccessListRepository } from '../repositories/access-list.repository';

@Injectable()
export class AccessListService {
  constructor(private readonly accessListRepository: AccessListRepository) {}

  async getOverview(): Promise<AllowedEmailsOverviewContract> {
    const allowedEmails = await this.accessListRepository.listEntries();

    return {
      module: 'allowed-emails',
      status: 'available',
      allowedEmails,
    };
  }

  async createEntry(
    input: CreateAllowedEmailInputContract,
  ): Promise<AllowedEmailContract> {
    const parsedInput = CreateAllowedEmailInputSchema.parse(input);

    return this.accessListRepository.createOrReactivateEntry(parsedInput);
  }

  async updateEntryStatus(
    id: string,
    input: UpdateAllowedEmailStatusInputContract,
  ): Promise<AllowedEmailContract> {
    const parsedInput = UpdateAllowedEmailStatusInputSchema.parse(input);

    return this.accessListRepository.updateEntryStatus(id, parsedInput);
  }
}
