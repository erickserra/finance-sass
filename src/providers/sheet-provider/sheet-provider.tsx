'use client';

import { EditAccountSheet } from '@/features/accounts/components/edit-account-sheet/edit-account-sheet';
import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet/new-account-sheet';
import { EditCategoriesSheet } from '@/features/categories/components/edit-categories-sheet/edit-categories-sheet';
import { NewCategoriesSheet } from '@/features/categories/components/new-categories-sheet/new-categories-sheet';
import { EditTransactionSheet } from '@/features/transactions/components/edit-transaction-sheet/edit-transaction-sheet';
import { NewTransactionSheet } from '@/features/transactions/components/new-transaction-sheet/new-transaction-sheet';
import { useMountedState } from 'react-use';

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategoriesSheet />
      <EditCategoriesSheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
