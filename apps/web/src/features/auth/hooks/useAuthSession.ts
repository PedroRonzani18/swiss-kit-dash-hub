import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/auth';
import { authKeys } from '@/api/queryKeys';
import type { AuthUser } from '@/types/auth';

type UseAuthSessionResult = {
  user: AuthUser | null;
  isLoading: boolean;
};

export function useAuthSession(): UseAuthSessionResult {
  const meQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: 0,
  });

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
