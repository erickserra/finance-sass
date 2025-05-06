import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';

type ResponseType = InferResponseType<(typeof rpcClient.api.transactions)['bulk-create']['$post']>;
type RequestType = InferRequestType<(typeof rpcClient.api.transactions)['bulk-create']['$post']>['json'];

export function useBulkCreateTransactions() {
  const queryClient = useQueryClient();
  const { onClose } = useEditTransactionSheetStore();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.transactions['bulk-create'].$post({
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to create transactions');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Transactions created');
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to create transactions`);
    },
  });

  return mutation;
}
