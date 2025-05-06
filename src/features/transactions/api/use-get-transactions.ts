import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { rpcClient } from '@/lib/hono';

export function useGetTransactions() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const accountId = searchParams.get('account_id') || '';

  const query = useQuery({
    queryKey: ['transactions', { from, to, accountId }],
    queryFn: async () => {
      const response = await rpcClient.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
