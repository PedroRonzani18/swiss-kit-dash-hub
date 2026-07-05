import { useQuery } from '@tanstack/react-query';
import { getAccessControlOverview } from '@/api/access-control';

export function useAccessControlOverview() {
  return useQuery({
    queryKey: ['access-control', 'overview'],
    queryFn: getAccessControlOverview,
    staleTime: 60_000,
  });
}
