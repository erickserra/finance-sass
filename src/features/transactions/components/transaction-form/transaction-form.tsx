'use client';

import { Button } from '@/components/ui/button';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  TransactionFormProps,
  TransactionFormValues,
} from '@/features/transactions/components/transaction-form/transaction-form.types';
import { transactionFormSchema } from '@/features/transactions/components/transaction-form/transaction-form.const';
import { Select } from '@/components/select/select';
import { DatePicker } from '@/components/date-picker/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/currency-input/currency-input';
import { convertAmountToMiliUnits } from '@/lib/utils';
import { Trash } from 'lucide-react';

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: TransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues,
  });

  const { errors } = useFormState({
    control: form.control,
    name: ['accountId', 'categoryId', 'date', 'amount'], // specify the field to track
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    const amountInMiliUnits = convertAmountToMiliUnits(parseFloat(data.amount));
    await onSubmit({ ...data, amount: amountInMiliUnits });
  };

  const handleDelete = async () => {
    await onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4 px-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  isError={errors?.date ? true : false}
                  ref={field.ref}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  disabled={field.disabled}
                  onChange={field.onChange}
                  isError={errors?.accountId ? true : false}
                />
              </FormControl>
              <FormDescription>
                To add an account that is not listed here, just type the name of the account and press enter.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  disabled={field.disabled}
                  onChange={field.onChange}
                  isError={errors?.categoryId ? true : false}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                To add an category that is not listed here, just type the name of the category and press enter.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} disabled={disabled} placeholder="Add a payee" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                  isError={errors?.amount ? true : false}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} disabled={disabled} placeholder="Option notes" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {id ? 'Save changes' : 'Create transaction'}
        </Button>

        {id ? (
          <Button
            disabled={disabled}
            type="button"
            className="w-full"
            size="icon"
            variant="outline"
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete Transaction
          </Button>
        ) : null}
      </form>
    </Form>
  );
};
