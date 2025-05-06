import { useQuery } from '@tanstack/react-query';

import { rpcClient } from '@/lib/hono';

export function useGetAccount(id?: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['account', { id }],
    queryFn: async () => {
      const response = await rpcClient.api.accounts[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
