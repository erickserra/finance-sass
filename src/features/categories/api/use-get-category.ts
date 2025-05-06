import { useQuery } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';

export function useGetCategory(id?: string) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', { id }],
    queryFn: async () => {
      const response = await rpcClient.api.categories[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
