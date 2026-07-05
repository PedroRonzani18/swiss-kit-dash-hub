import { ApiProperty } from '@nestjs/swagger';
import type {
  TaskContract,
  TaskStatusContract,
  TasksOverviewContract,
} from '@swisskit/contracts/tasks';

export class TaskDto implements TaskContract {
  @ApiProperty({ example: 'task-1' })
  id!: string;

  @ApiProperty({ example: 'Review template structure' })
  title!: string;

  @ApiProperty({
    nullable: true,
    example: 'Use this module as a copyable reference.',
  })
  description!: string | null;

  @ApiProperty({ example: 'todo', enum: ['todo', 'doing', 'done'] })
  status!: TaskStatusContract;
}

export class TasksOverviewDto implements TasksOverviewContract {
  @ApiProperty({ example: 'tasks' })
  module!: 'tasks';

  @ApiProperty({ example: 'available' })
  status!: 'available';

  @ApiProperty({ type: () => [TaskDto] })
  tasks!: TaskDto[];
}
