import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersOverviewDto } from '../dto/user-profile.dto';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UsersOverviewDto })
  getOverview(): Promise<UsersOverviewDto> {
    return this.usersService.getOverview();
  }
}
