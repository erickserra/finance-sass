import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<(typeof rpcClient.api.accounts)['bulk-delete']['$post']>['json'];
type ResponseType = InferResponseType<(typeof rpcClient.api.accounts)['bulk-delete']['$post']>;

export function useBulkDeleteAccounts() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.accounts['bulk-delete'].$post({ json });

      if (!response.ok) {
        throw new Error('Failed to bulk delete accounts');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Accounts deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error(`Failed to bulk delete accounts`);
    },
  });

  return mutation;
}
