import { useQuery } from '@tanstack/react-query';
import { getUsersOverview } from '@/api/users';
import { usersKeys } from '@/api/queryKeys';

export function useUsersOverview() {
  return useQuery({
    queryKey: usersKeys.overview(),
    queryFn: getUsersOverview,
    staleTime: 60_000,
  });
}
