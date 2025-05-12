export type ValidateTransactionsWorkerData = {
  success: boolean;
  transactions: Array<{ date: string; amount: string; payee: string | null }>;
  errors: Record<string, number[]>;
};
