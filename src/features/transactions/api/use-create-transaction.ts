import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useNewTransactionSheetStore } from '@/features/transactions/stores/use-new-transaction-store';

type ResponseType = InferResponseType<typeof rpcClient.api.transactions.$post>;
type RequestType = InferRequestType<typeof rpcClient.api.transactions.$post>['json'];

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { onClose } = useNewTransactionSheetStore();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.transactions.$post({
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to post transaction');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Transaction created');
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      onClose();
    },
    onError: () => {
      toast.error(`Failed to create transaction`);
    },
  });

  return mutation;
}
