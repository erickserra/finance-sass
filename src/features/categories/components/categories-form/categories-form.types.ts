import { z } from 'zod';
import { categoriesFormSchema } from './categories-form.const';

export type CategoriesFormValues = z.input<typeof categoriesFormSchema>;

export type CategoriesFormProps = {
  id?: string;
  defaultValues?: CategoriesFormValues;
  onSubmit: (data: CategoriesFormValues) => Promise<unknown>;
  onDelete?: () => Promise<unknown>;
  disabled?: boolean;
};
