import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessListEntryDto,
  AccessListOverviewDto,
  CreateAccessListEntryDto,
  UpdateAccessListEntryStatusDto,
} from '../dto/access-list.dto';
import { AccessListService } from '../services/access-list.service';

@ApiTags('Allowed Emails')
@Controller('allowed-emails')
export class AccessListController {
  constructor(private readonly accessListService: AccessListService) {}

  @Get()
  @ApiOkResponse({ type: AccessListOverviewDto })
  getOverview(): Promise<AccessListOverviewDto> {
    return this.accessListService.getOverview();
  }

  @Post()
  @ApiCreatedResponse({ type: AccessListEntryDto })
  createEntry(
    @Body() input: CreateAccessListEntryDto,
  ): Promise<AccessListEntryDto> {
    return this.accessListService.createEntry(input);
  }

  @Patch(':id/status')
  @ApiOkResponse({ type: AccessListEntryDto })
  updateEntryStatus(
    @Param('id') id: string,
    @Body() input: UpdateAccessListEntryStatusDto,
  ): Promise<AccessListEntryDto> {
    return this.accessListService.updateEntryStatus(id, input);
  }
}
