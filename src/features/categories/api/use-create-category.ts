import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useNewCategoryStore } from '../hooks/use-new-category-store';

type ResponseType = InferResponseType<typeof rpcClient.api.categories.$post>;
type RequestType = InferRequestType<typeof rpcClient.api.categories.$post>['json'];

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { onClose } = useNewCategoryStore();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.categories.$post({
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to post category');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
    onError: () => {
      toast.error(`Failed to create category`);
    },
  });

  return mutation;
}
