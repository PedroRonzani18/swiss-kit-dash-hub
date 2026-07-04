import { Injectable } from '@nestjs/common';
import type { AllowedEmailsOverviewContract } from '@swisskit/contracts/allowed-emails';
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
}
