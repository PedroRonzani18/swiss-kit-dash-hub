import {
  TasksOverviewSchema,
  type TasksOverviewContract,
} from '@swisskit/contracts/tasks';
import { apiClient } from './client';

export async function getTasksOverview(): Promise<TasksOverviewContract> {
  return apiClient.getWithSchema('/tasks', TasksOverviewSchema);
}
