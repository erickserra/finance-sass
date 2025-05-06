import { z } from 'zod';
import { accountFormSchema } from './account-form.const';

export type AccountFormValues = z.input<typeof accountFormSchema>;

export type AccountFormProps = {
  id?: string;
  defaultValues?: AccountFormValues;
  onSubmit: (data: AccountFormValues) => Promise<unknown>;
  onDelete?: () => Promise<unknown>;
  disabled?: boolean;
};
