import { useEditCategoryStore } from '@/features/categories/hooks/use-edit-category-store';
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';
import { cn } from '@/lib/utils';
import { TriangleAlertIcon } from 'lucide-react';

type Props = {
  transactionId: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumnCell = ({ transactionId, category, categoryId }: Props) => {
  const { onOpen: onOpenCategorySheet } = useEditCategoryStore();
  const { onOpen: onOpenTransactionSheet } = useEditTransactionSheetStore();

  const onClick = () => {
    if (categoryId) {
      onOpenCategorySheet(categoryId);
    } else {
      onOpenTransactionSheet(transactionId);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn('pl-3 flex items-center cursor-pointer hover:underline', !category ? 'text-rose-500' : '')}
    >
      {!category ? <TriangleAlertIcon className="mr-2 size-4 shrink-0" /> : null}
      {category || 'Uncategorized'}
    </div>
  );
};
