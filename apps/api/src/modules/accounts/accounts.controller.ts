import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUserContract } from '@/common/contracts';
import { CurrentUser } from '@/common/auth';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth('access-token')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUserContract) {
    return this.accountsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.accountsService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() input: CreateAccountDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.accountsService.create(user.id, input);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateAccountDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.accountsService.update(id, user.id, input);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.accountsService.remove(id, user.id);
  }
}
