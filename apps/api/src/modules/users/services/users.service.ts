import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateUserInputContract,
  UpdateUserStatusInputContract,
  UserProfileContract,
  UsersOverviewContract,
} from '@swisskit/contracts/users';
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

  createOrReactivate(
    input: CreateUserInputContract,
  ): Promise<UserProfileContract> {
    return this.usersRepository.createOrReactivate(input);
  }

  async updateStatus(
    id: string,
    input: UpdateUserStatusInputContract,
    actorId: string,
  ): Promise<UserProfileContract> {
    try {
      return await this.usersRepository.updateStatus(id, input, actorId);
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }

      if (
        error instanceof Error &&
        ['SELF_DEACTIVATION', 'LAST_ACTIVE_ADMIN'].includes(error.message)
      ) {
        throw new ForbiddenException('User cannot be deactivated');
      }

      throw error;
    }
  }
}
