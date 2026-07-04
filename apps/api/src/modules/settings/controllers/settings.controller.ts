import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SettingsOverviewDto } from '../dto/settings-overview.dto';
import { SettingsService } from '../services/settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOkResponse({ type: SettingsOverviewDto })
  getOverview(): SettingsOverviewDto {
    return this.settingsService.getOverview();
  }
}
