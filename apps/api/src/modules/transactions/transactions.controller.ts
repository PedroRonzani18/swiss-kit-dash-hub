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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionBulkDto } from './dto/create-transaction-bulk.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUserContract) {
    return this.transactionsService.findAll(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.transactionsService.findOne(id, user.id);
  }

  @Post('bulk')
  createBulk(
    @Body() input: CreateTransactionBulkDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.transactionsService.createBulk(user.id, input.items);
  }

  @Post()
  create(
    @Body() input: CreateTransactionDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.transactionsService.create(user.id, input);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateTransactionDto,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.transactionsService.update(id, user.id, input);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUserContract,
  ) {
    return this.transactionsService.remove(id, user.id);
  }
}
