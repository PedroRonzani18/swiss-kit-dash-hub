import type { QueryClient } from "@tanstack/react-query";

type QueryKeyFactory = () => readonly unknown[];

export async function invalidateQueryKeys(
  queryClient: QueryClient,
  keys: QueryKeyFactory[],
): Promise<void> {
  await Promise.all(
    keys.map((keyFactory) =>
      queryClient.invalidateQueries({ queryKey: keyFactory() }),
    ),
  );
}
