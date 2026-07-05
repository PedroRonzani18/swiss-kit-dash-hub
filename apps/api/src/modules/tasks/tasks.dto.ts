import { ApiProperty } from '@nestjs/swagger';
import type {
  TaskContract,
  TaskStatusContract,
  TasksOverviewContract,
} from '@swisskit/contracts/tasks';

export class TaskDto implements TaskContract {
  @ApiProperty({ example: 'task-1' })
  id!: string;

  @ApiProperty({ example: 'tasks.items.reviewTemplate.title' })
  titleKey!: string;

  @ApiProperty({
    nullable: true,
    example: 'tasks.items.reviewTemplate.description',
  })
  descriptionKey!: string | null;

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
