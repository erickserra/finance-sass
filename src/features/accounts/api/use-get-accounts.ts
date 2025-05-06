import { useQuery } from '@tanstack/react-query';

import { rpcClient } from '@/lib/hono';

export function useGetAccounts() {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await rpcClient.api.accounts.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
