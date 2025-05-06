import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';

type ResponseType = InferResponseType<(typeof rpcClient.api.transactions)[':id']['$patch']>;
type RequestType = InferRequestType<(typeof rpcClient.api.transactions)[':id']['$patch']>['json'];

export function useEditTransaction(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditTransactionSheetStore();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.transactions[':id'].$patch({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to edit transaction');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Transaction updated');
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to edit transaction`);
    },
  });

  return mutation;
}
