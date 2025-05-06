import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useNewAccount } from '../hooks/use-new-account';

type ResponseType = InferResponseType<typeof rpcClient.api.accounts.$post>;
type RequestType = InferRequestType<typeof rpcClient.api.accounts.$post>['json'];

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { onClose } = useNewAccount();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.accounts.$post({
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to post accounts');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Account created');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      onClose();
    },
    onError: () => {
      toast.error(`Failed to create account`);
    },
  });

  return mutation;
}
