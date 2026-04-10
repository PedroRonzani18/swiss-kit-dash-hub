import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGoogleAuthUrl,
  logout as logoutRequest,
  parseAuthPopupFromText,
} from '@/api/auth';
import { getApiOrigin } from '@/api/client';
import {
  clearAuthAndFinanceQueries,
  syncAuthSession,
} from '../lib/authSession';
import {
  openGoogleAuthPopup,
  waitForOAuthPopupCompletion,
} from '../lib/oauthPopup';

type UseAuthActionsResult = {
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export function useAuthActions(): UseAuthActionsResult {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUrl = getGoogleAuthUrl();
      const popup = openGoogleAuthPopup(authUrl);

      if (!popup) {
        window.location.href = authUrl;
        return;
      }

      await waitForOAuthPopupCompletion({
        popup,
        apiOrigin: getApiOrigin(),
        parseAuthPopupFromText,
      });
      await syncAuthSession(queryClient);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } finally {
      clearAuthAndFinanceQueries(queryClient);
      setIsLoading(false);
    }
  }, [queryClient]);

  return {
    isLoading,
    loginWithGoogle,
    logout,
  };
}
