import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.transactionsService.findAll(userId);
  }

  @Get(':id')
  @ApiQuery({ name: 'userId', required: false })
  findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.transactionsService.findOne(id, userId);
  }

  @Post()
  create(@Body() input: CreateTransactionDto) {
    return this.transactionsService.create(input);
  }

  @Patch(':id')
  @ApiQuery({ name: 'userId', required: false })
  update(
    @Param('id') id: string,
    @Body() input: UpdateTransactionDto,
    @Query('userId') userId?: string,
  ) {
    return this.transactionsService.update(id, input, userId);
  }

  @Delete(':id')
  @ApiQuery({ name: 'userId', required: false })
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.transactionsService.remove(id, userId);
  }
}
