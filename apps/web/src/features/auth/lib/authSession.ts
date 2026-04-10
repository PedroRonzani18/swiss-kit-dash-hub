import type { QueryClient } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import { authKeys, financeKeys } from '@/api/queryKeys';

export async function syncAuthSession(queryClient: QueryClient): Promise<void> {
  await queryClient.invalidateQueries({ queryKey: authKeys.me() });
  await queryClient.fetchQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 0,
  });
  await queryClient.invalidateQueries({ queryKey: financeKeys.root });
}

export function clearAuthAndFinanceQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: authKeys.root });
  queryClient.removeQueries({ queryKey: financeKeys.root });
}

export function clearFinanceQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: financeKeys.root });
}
