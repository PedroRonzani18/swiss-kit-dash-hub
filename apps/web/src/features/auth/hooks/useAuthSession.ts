import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import { authKeys } from '@/api/queryKeys';
import type { AuthUser } from '@/types/auth';
import { clearFinanceQueries } from '../lib/authSession';

type UseAuthSessionResult = {
  user: AuthUser | null;
  isLoading: boolean;
};

export function useAuthSession(): UseAuthSessionResult {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (meQuery.isError) {
      clearFinanceQueries(queryClient);
    }
  }, [meQuery.isError, queryClient]);

  const user = useMemo<AuthUser | null>(() => {
    if (!meQuery.data) {
      return null;
    }

    return {
      id: meQuery.data.id,
      email: meQuery.data.email,
      name: meQuery.data.name,
      provider: meQuery.data.provider,
    };
  }, [meQuery.data]);

  return {
    user,
    isLoading: meQuery.isLoading,
  };
}
