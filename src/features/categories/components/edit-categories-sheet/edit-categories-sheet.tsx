import { useEditCategory } from '../../api/use-edit-category';
import { useDeleteCategory } from '../../api/use-delete-category';
import { useGetCategory } from '../../api/use-get-category';

import { useConfirm } from '@/hooks/use-confirm';
import { useEditCategoryStore } from '../../hooks/use-edit-category-store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoriesForm } from '../categories-form/categories-form';
import { CategoriesFormValues } from '../categories-form/categories-form.types';

export const EditCategoriesSheet = () => {
  const { isOpen, onClose, id } = useEditCategoryStore();
  const mutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const categoryQuery = useGetCategory(id);

  const { ConfirmationDialog, confirm } = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this category',
  });

  const defaultValues = categoryQuery.data ? { name: categoryQuery.data.name } : { name: '' };

  const isDisabled = categoryQuery.isLoading || mutation.isPending || deleteMutation.isPending;

  const onSubmit = (data: CategoriesFormValues) => {
    return mutation.mutateAsync(data);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      return deleteMutation.mutateAsync();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>
          {categoryQuery.isLoading ? (
            <div className="h-full px-4 pt-4">
              <Skeleton className="w-full h-[32px] mb-4" />
              <Skeleton className="h-[32px] w-full" />
            </div>
          ) : (
            <CategoriesForm
              id={id}
              onDelete={handleDelete}
              onSubmit={onSubmit}
              defaultValues={defaultValues}
              disabled={isDisabled}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
