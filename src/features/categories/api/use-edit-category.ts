import { InferRequestType, InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditCategoryStore } from '../hooks/use-edit-category-store';

type ResponseType = InferResponseType<(typeof rpcClient.api.categories)[':id']['$patch']>;
type RequestType = InferRequestType<(typeof rpcClient.api.categories)[':id']['$patch']>['json'];

export function useEditCategory(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditCategoryStore();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await rpcClient.api.categories[':id'].$patch({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to edit category');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['category', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary
      onClose();
    },
    onError: () => {
      toast.error(`Failed to edit category`);
    },
  });

  return mutation;
}
