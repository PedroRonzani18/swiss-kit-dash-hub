import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '@/common/auth';
import { TasksOverviewDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @RequirePermissions('tasks:read')
  @ApiOkResponse({ type: TasksOverviewDto })
  getOverview(): TasksOverviewDto {
    return this.tasksService.getOverview();
  }
}
