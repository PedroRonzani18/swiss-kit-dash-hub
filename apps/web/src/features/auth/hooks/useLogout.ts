import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logout as logoutRequest } from '@/api/auth';
import { clearAuthQueries } from '../lib/authSession';

type UseLogoutResult = {
  isLoading: boolean;
  logout: () => Promise<void>;
};

export function useLogout(): UseLogoutResult {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } finally {
      clearAuthQueries(queryClient);
      setIsLoading(false);
    }
  }, [queryClient]);

  return {
    isLoading,
    logout,
  };
}
