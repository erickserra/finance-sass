import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteAccount } from '../../api/use-delete-account';
import { useEditAccount } from '../../api/use-edit-account';
import { useGetAccount } from '../../api/use-get-account';
import { useEditAccountState } from '../../hooks/use-edit-account';
import { AccountForm } from '../account-form/account-form';
import { AccountFormValues } from '../account-form/account-form.types';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useEditAccountState();

  const mutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const accountQuery = useGetAccount(id);

  const { ConfirmationDialog, confirm } = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this account',
  });

  const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: '' };

  const isDisabled = accountQuery.isLoading || mutation.isPending || deleteMutation.isPending;

  const onSubmit = (data: AccountFormValues) => {
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit your account.</SheetDescription>
          </SheetHeader>
          {accountQuery.isLoading ? (
            <div className="h-full px-4 pt-4">
              <Skeleton className="w-full h-[32px] mb-4" />
              <Skeleton className="h-[32px] w-full" />
            </div>
          ) : (
            <AccountForm
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
