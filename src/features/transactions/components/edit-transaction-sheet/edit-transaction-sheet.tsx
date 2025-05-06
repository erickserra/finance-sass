import { useConfirm } from '@/hooks/use-confirm';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionSubmitPayload } from '@/features/transactions/components/transaction-form/transaction-form.types';
import { useEditTransactionSheetStore } from '@/features/transactions/stores/use-edit-transaction-store';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { TransactionForm } from '@/features/transactions/components/transaction-form/transaction-form';
import { convertAmountFromMiliUnits } from '@/lib/utils';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useEditTransactionSheetStore();
  const { ConfirmationDialog, confirm } = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this transaction',
  });

  const mutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const transactionQuery = useGetTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const defaultFormValues = transactionQuery?.data
    ? {
        date: new Date(transactionQuery?.data.date),
        accountId: transactionQuery?.data.accountId,
        categoryId: transactionQuery?.data.categoryId,
        payee: transactionQuery?.data.payee,
        amount: String(convertAmountFromMiliUnits(transactionQuery?.data.amount)),
        notes: transactionQuery?.data.notes,
      }
    : undefined;

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    transactionQuery.isLoading ||
    deleteMutation?.isPending ||
    mutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

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

  const onSubmit = (data: TransactionSubmitPayload) => {
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
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit your transaction.</SheetDescription>
          </SheetHeader>
          {transactionQuery.isLoading ? (
            <div className="h-full px-4 pt-4">
              {new Array(13).fill(1).map((key) => (
                <Skeleton key={key} className="w-full h-[32px] mb-6" />
              ))}
            </div>
          ) : (
            <TransactionForm
              disabled={isPending || isLoading}
              id={id}
              onDelete={handleDelete}
              onSubmit={onSubmit}
              defaultValues={defaultFormValues}
              categoryOptions={categoryOptions}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
