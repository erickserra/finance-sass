import { useCreateCategory } from '../../api/use-create-category';
import { useNewCategoryStore } from '../../hooks/use-new-category-store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CategoriesFormValues } from '../categories-form/categories-form.types';
import { CategoriesForm } from '../categories-form/categories-form';

export const NewCategoriesSheet = () => {
  const { isOpen, onClose } = useNewCategoryStore();

  const mutation = useCreateCategory();

  const onSubmit = (data: CategoriesFormValues) => {
    return mutation.mutateAsync(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>Create a new category to track your transactions.</SheetDescription>
        </SheetHeader>
        <CategoriesForm onSubmit={onSubmit} disabled={mutation.isPending} />
      </SheetContent>
    </Sheet>
  );
};
