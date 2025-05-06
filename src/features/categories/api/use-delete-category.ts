import { InferResponseType } from 'hono';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rpcClient } from '@/lib/hono';
import { toast } from 'sonner';
import { useEditCategoryStore } from '../hooks/use-edit-category-store';

type ResponseType = InferResponseType<(typeof rpcClient.api.categories)[':id']['$delete']>;

export function useDeleteCategory(id?: string) {
  const queryClient = useQueryClient();
  const { onClose } = useEditCategoryStore();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await rpcClient.api.categories[':id'].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['category', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'], exact: false });
      //TODO: invalidate summary and transactions
      onClose();
    },
    onError: () => {
      toast.error(`Failed to delete category`);
    },
  });

  return mutation;
}
