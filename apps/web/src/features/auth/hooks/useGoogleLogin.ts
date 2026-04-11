import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGoogleAuthUrl, parseAuthPopupFromText } from '@/api/auth';
import { getApiOrigin } from '@/api/client';
import { syncAuthSession } from '../lib/authSession';
import {
  openGoogleAuthPopup,
  waitForOAuthPopupCompletion,
} from '../lib/oauthPopup';

type UseGoogleLoginResult = {
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
};

export function useGoogleLogin(): UseGoogleLoginResult {
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

  return {
    isLoading,
    loginWithGoogle,
  };
}
