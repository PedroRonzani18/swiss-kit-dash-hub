import type { QueryClient } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import { authKeys } from '@/api/queryKeys';

export async function syncAuthSession(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: authKeys.me() });
  await queryClient.fetchQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 0,
  });
}

export function clearAuthQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: authKeys.root });
}
