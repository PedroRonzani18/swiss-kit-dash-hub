import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  @ApiQuery({ name: 'userId', required: false })
  findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Post()
  create(@Body() input: CreateAccountDto) {
    return this.accountsService.create(input);
  }

  @Patch(':id')
  @ApiQuery({ name: 'userId', required: false })
  update(
    @Param('id') id: string,
    @Body() input: UpdateAccountDto,
    @Query('userId') userId?: string,
  ) {
    return this.accountsService.update(id, input, userId);
  }

  @Delete(':id')
  @ApiQuery({ name: 'userId', required: false })
  remove(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.accountsService.remove(id, userId);
  }
}
