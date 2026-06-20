import { useCallback, useState } from 'react';
import { getGoogleAuthUrl } from '@/api/auth';

type UseGoogleLoginResult = {
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
};

export function useGoogleLogin(): UseGoogleLoginResult {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUrl = getGoogleAuthUrl();
      window.location.assign(authUrl);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return {
    isLoading,
    loginWithGoogle,
  };
}
