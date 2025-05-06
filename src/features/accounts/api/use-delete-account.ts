import { InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditAccountState } from '../hooks/use-edit-account';

type ResponseType = InferResponseType<(typeof rpcClient.api.accounts)[':id']['$delete']>;

export function useDeleteAccount(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditAccountState();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await rpcClient.api.accounts[':id'].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Account deleted');
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to delete account`);
    },
  });

  return mutation;
}
