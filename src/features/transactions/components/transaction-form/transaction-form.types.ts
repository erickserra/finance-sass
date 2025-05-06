import { transactionFormSchema } from '@/features/transactions/components/transaction-form/transaction-form.const';
import { z } from 'zod';

export type TransactionFormValues = z.input<typeof transactionFormSchema>;

export type TransactionSubmitPayload = Omit<TransactionFormValues, 'amount'> & { amount: number };

export type TransactionFormProps = {
  id?: string;
  defaultValues?: TransactionFormValues | undefined;
  onSubmit: (data: TransactionSubmitPayload) => Promise<unknown>;
  onDelete?: () => Promise<unknown>;
  disabled?: boolean;
  accountOptions: Array<{ label: string; value: string }>;
  categoryOptions: Array<{ label: string; value: string }>;
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};
