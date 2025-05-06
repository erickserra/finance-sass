import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof rpcClient.api.categories)['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<(typeof rpcClient.api.categories)['bulk-delete']['$post']>;

export function useBulkDeleteCategories() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.categories['bulk-delete'].$post({ json });

      if (!response.ok) {
        throw new Error('Failed to bulk delete categories');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Categories deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error(`Failed to bulk delete categories`);
    },
  });

  return mutation;
}
