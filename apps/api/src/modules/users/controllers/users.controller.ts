import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequirePermissions } from '@/common/auth';
import type { AuthenticatedUserContract } from '@/common/contracts';
import {
  CreateUserDto,
  UpdateUserStatusDto,
  UserProfileDto,
  UsersOverviewDto,
} from '../dto/user-profile.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('users:read')
  @ApiOkResponse({ type: UsersOverviewDto })
  getOverview(): Promise<UsersOverviewDto> {
    return this.usersService.getOverview();
  }

  @Post()
  @RequirePermissions('users:create')
  @ApiCreatedResponse({ type: UserProfileDto })
  createOrReactivate(@Body() input: CreateUserDto): Promise<UserProfileDto> {
    return this.usersService.createOrReactivate(input);
  }

  @Patch(':id/status')
  @RequirePermissions('users:update')
  @ApiOkResponse({ type: UserProfileDto })
  updateStatus(
    @Param('id') id: string,
    @Body() input: UpdateUserStatusDto,
    @CurrentUser() actor: AuthenticatedUserContract,
  ): Promise<UserProfileDto> {
    return this.usersService.updateStatus(id, input, actor.id);
  }
}
