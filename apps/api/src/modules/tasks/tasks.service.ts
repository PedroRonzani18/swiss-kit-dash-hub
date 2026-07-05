import { Injectable } from '@nestjs/common';
import type { TasksOverviewContract } from '@swisskit/contracts/tasks';

@Injectable()
export class TasksService {
  getOverview(): TasksOverviewContract {
    return {
      module: 'tasks',
      status: 'available',
      tasks: [
        {
          id: 'task-1',
          title: 'Review template structure',
          description:
            'Use this module as a copyable reference for new systems.',
          status: 'done',
        },
        {
          id: 'task-2',
          title: 'Add a product-specific module',
          description:
            'Start with the scaffold and replace static data with real API behavior.',
          status: 'todo',
        },
      ],
    };
  }
}
