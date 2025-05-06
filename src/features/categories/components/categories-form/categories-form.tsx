'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { CategoriesFormProps, CategoriesFormValues } from './categories-form.types';
import { categoriesFormSchema } from './categories-form.const';

export const CategoriesForm = ({
  id,
  defaultValues = { name: '' },
  onSubmit,
  onDelete,
  disabled,
}: CategoriesFormProps) => {
  const form = useForm<CategoriesFormValues>({
    resolver: zodResolver(categoriesFormSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async (data: CategoriesFormValues) => {
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
                <Input disabled={disabled} placeholder="e.g. Food, Travel, Market" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={disabled} type="submit" className="w-full" disabled={disabled || !form.formState.isDirty}>
          {id ? 'Save changes' : 'Create category'}
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
            Delete Category
          </Button>
        ) : null}
      </form>
    </Form>
  );
};
