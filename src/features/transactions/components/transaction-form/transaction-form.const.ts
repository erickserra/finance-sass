import { z } from 'zod';

export const transactionFormSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string({ message: 'Field is required' }),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});
