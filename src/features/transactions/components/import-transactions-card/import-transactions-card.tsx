'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requiredColumns } from '@/features/transactions/components/import-transactions-card/import-transactions-card.const';
import { useValidateImportTransactions } from '@/features/transactions/components/import-transactions-card/import-transactions-card.hooks';
import { ImportTransactionsTable } from '@/features/transactions/components/import-transactions-card/import-transactions-table/import-transactions-table';
import { AlertCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export function ImportTransactionsCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColumns, setSelectedColumns] = useState<Record<string, string | null>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, number[]>>({});
  const [isWorkerProcessing, setIsWorkerProcessing] = useState(false);

  const headers = useMemo(() => data[0], [data]);
  const body = useMemo(() => data.slice(1), [data]);
  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const errorsLength = useMemo(() => Object.keys(rowErrors).length, [rowErrors]);
  const isContinueButtonDisabled = !!errorsLength || progress < requiredColumns.length;

  const { validateImportWorker } = useValidateImportTransactions({
    onMessage: (event) => {
      if (!event.data.success) {
        setRowErrors(event.data.errors);
        toast.error(
          `Failed to load transactions. There are ${
            Object.keys(event.data.errors).length
          } rows with errors on your CSV`,
        );
      }
      setIsWorkerProcessing(false);
    },
    onWorkerError: () => setIsWorkerProcessing(false),
  });

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prev) => {
      const currentSelectedColumns = { ...prev };

      let newColumnValue = value === 'skip' ? null : value;

      if (newColumnValue === null && errorsLength > 0) {
        setRowErrors({});
      }

      for (const key in currentSelectedColumns) {
        if (currentSelectedColumns[key] === value) {
          currentSelectedColumns[key] = null;
        }
      }

      currentSelectedColumns[`column_${columnIndex}`] = newColumnValue;

      return currentSelectedColumns;
    });
  };

  const handleContinue = async () => {
    runWorkerValidation();
  };

  const runWorkerValidation = () => {
    setIsWorkerProcessing(true);

    const workerMessage = {
      headers,
      body,
      selectedColumns,
    };

    if (validateImportWorker) {
      validateImportWorker.postMessage(workerMessage);
    }
  };

  return (
    <Card className="border-none dropd-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Import Transaction</CardTitle>
        <div className="flex items-center gap-4">
          <Button onClick={onCancel} variant="destructive">
            <X className="size-4 mr-1" /> Cancel
          </Button>
          <Button isLoading={isWorkerProcessing} disabled={isContinueButtonDisabled} onClick={handleContinue}>
            Continue ({progress} / {requiredColumns.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!!errorsLength ? (
          <div className="flex gap-4 mb-4">
            <div className="flex gap-2 items-center">
              <span className="block h-[16px] w-[24px] bg-green-600/10 border-green-600 border-2"></span>
              <span className="text-sm font-bold"> Cell accepted</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="block h-[16px] w-[24px] bg-destructive/10 border-destructive border-2"></span>
              <span className="text-sm font-bold">Cell with error</span>
            </div>
          </div>
        ) : null}

        <div>
          {!!errorsLength ? (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                You have {errorsLength} rows with errors. We cannot use them the way they are, please cancel this
                import, fix your CSV File and reupload it here.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="info" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>
                You are attempting to import {body.length} transactions. Please select the column names that match their
                information and press continue.
              </AlertDescription>
            </Alert>
          )}

          <ImportTransactionsTable
            rowErrors={rowErrors}
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
