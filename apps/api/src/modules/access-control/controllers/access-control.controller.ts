import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessControlOverviewDto } from '../dto/access-control.dto';
import { AccessControlService } from '../services/access-control.service';

@ApiTags('Access Control')
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get()
  @ApiOkResponse({ type: AccessControlOverviewDto })
  getOverview(): AccessControlOverviewDto {
    return this.accessControlService.getOverview();
  }
}
