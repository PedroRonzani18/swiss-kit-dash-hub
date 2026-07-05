import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '@/common/auth';
import { AccessControlOverviewDto } from '../dto/access-control.dto';
import { AccessControlService } from '../services/access-control.service';

@ApiTags('Access Control')
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Get()
  @RequirePermissions('access-control:read')
  @ApiOkResponse({ type: AccessControlOverviewDto })
  getOverview(): Promise<AccessControlOverviewDto> {
    return this.accessControlService.getOverview();
  }
}
