'use client';

import { ValidateTransactionsWorkerData } from '@/features/transactions/components/import-transactions-card/import-transactions-card.types';
import { useEffect, useRef } from 'react';

type Props = {
  onWorkerError: () => void;
  onMessage: (event: MessageEvent<ValidateTransactionsWorkerData>) => void;
};

export function useValidateImportTransactions({ onWorkerError, onMessage }: Props) {
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    workerRef.current = new window.Worker('/workers/validate-import-transactions.js', { type: 'module' });

    workerRef.current.onmessage = (event: MessageEvent<ValidateTransactionsWorkerData>) => {
      onMessage(event);
    };

    workerRef.current.onerror = (error) => {
      onWorkerError();
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return {
    validateImportWorker: workerRef.current,
  };
}
