import { useQuery } from '@tanstack/react-query';
import { getTasksOverview } from '@/api/tasks';

export function useTasksOverview() {
  return useQuery({
    queryKey: ['tasks', 'overview'],
    queryFn: getTasksOverview,
  });
}
