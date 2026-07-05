import { z } from 'zod';

export const TaskStatusSchema = z.enum(['todo', 'doing', 'done']);

export const TaskSchema = z.object({
  id: z.string(),
  titleKey: z.string().min(1),
  descriptionKey: z.string().min(1).nullable(),
  status: TaskStatusSchema,
});

export const TasksOverviewSchema = z.object({
  module: z.literal('tasks'),
  status: z.literal('available'),
  tasks: z.array(TaskSchema),
});

export type TaskStatusContract = z.infer<typeof TaskStatusSchema>;
export type TaskContract = z.infer<typeof TaskSchema>;
export type TasksOverviewContract = z.infer<typeof TasksOverviewSchema>;
