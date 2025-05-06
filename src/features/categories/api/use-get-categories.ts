import { useQuery } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';

export function useGetCategories() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await rpcClient.api.categories.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
