import { useQuery } from '@tanstack/react-query';

import { rpcClient } from '@/lib/hono';

export function useGetTransaction(id?: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await rpcClient.api.transactions[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
