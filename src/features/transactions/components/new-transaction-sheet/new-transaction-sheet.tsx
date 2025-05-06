import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

import { useNewTransactionSheetStore } from '@/features/transactions/stores/use-new-transaction-store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { TransactionForm } from '@/features/transactions/components/transaction-form/transaction-form';
import { Loader2 } from 'lucide-react';

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransactionSheetStore();

  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name,
    });
  };

  const onCreateAccount = (name: string) => {
    accountMutation.mutate({
      name,
    });
  };

  const onSubmit = (data: any) => {
    return createMutation.mutateAsync(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full px-4">
            <Loader2 className="animate-spin size-8" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
