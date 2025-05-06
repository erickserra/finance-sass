'use client';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { AccountFormProps, AccountFormValues } from './account-form.types';
import { accountFormSchema } from './account-form.const';

export const AccountForm = ({ id, defaultValues = { name: '' }, onSubmit, onDelete, disabled }: AccountFormProps) => {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: AccountFormValues) => {
    await onSubmit(data);
  };

  const handleDelete = async () => {
    await onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4 px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="e.g. Cash, Bank, Credit Card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={disabled} type="submit" className="w-full" disabled={disabled || !form.formState.isDirty}>
          {id ? 'Save changes' : 'Create Account'}
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
            Delete Account
          </Button>
        ) : null}
      </form>
    </Form>
  );
};
