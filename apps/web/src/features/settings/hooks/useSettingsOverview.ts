import { useQuery } from '@tanstack/react-query';
import { getSettingsOverview } from '@/api/settings';
import { settingsKeys } from '@/api/queryKeys';

export function useSettingsOverview() {
  return useQuery({
    queryKey: settingsKeys.overview(),
    queryFn: getSettingsOverview,
    staleTime: 60_000,
  });
}
