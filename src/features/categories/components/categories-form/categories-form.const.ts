import { z } from 'zod';

export const categoriesFormSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
});
