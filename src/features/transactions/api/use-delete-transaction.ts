import { InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';

type ResponseType = InferResponseType<(typeof rpcClient.api.transactions)[':id']['$delete']>;

export function useDeleteTransaction(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditTransactionSheetStore();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await rpcClient.api.transactions[':id'].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Transaction deleted');
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to delete transaction`);
    },
  });

  return mutation;
}
