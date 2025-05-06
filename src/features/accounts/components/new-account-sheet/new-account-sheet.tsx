import { useCreateAccount } from '../../api/use-create-account';
import { useNewAccount } from '../../hooks/use-new-account';
import { AccountForm } from '../account-form/account-form';
import { AccountFormValues } from '../account-form/account-form.types';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

  const onSubmit = (data: AccountFormValues) => {
    return mutation.mutateAsync(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>Create a new account to track your transactions.</SheetDescription>
        </SheetHeader>
        <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} />
      </SheetContent>
    </Sheet>
  );
};
