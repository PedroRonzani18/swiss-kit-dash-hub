import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessListOverviewDto } from '../dto/access-list.dto';
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
}
