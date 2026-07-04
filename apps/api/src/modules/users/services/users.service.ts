import { Injectable } from '@nestjs/common';
import type { UsersOverviewContract } from '@swisskit/contracts/users';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getOverview(): Promise<UsersOverviewContract> {
    const users = await this.usersRepository.listProfiles();

    return {
      module: 'users',
      status: 'available',
      users,
    };
  }
}
