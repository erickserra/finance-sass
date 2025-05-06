import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditAccountState } from '../hooks/use-edit-account';

type ResponseType = InferResponseType<(typeof rpcClient.api.accounts)[':id']['$patch']>;
type RequestType = InferRequestType<(typeof rpcClient.api.accounts)[':id']['$patch']>['json'];

export function useEditAccount(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditAccountState();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.accounts[':id'].$patch({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to edit account');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Account updated');
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to edit account`);
    },
  });

  return mutation;
}
