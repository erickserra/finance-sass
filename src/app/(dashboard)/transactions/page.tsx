'use client';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionsDataTableColumns } from './_components/table/columns';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { Loader2, PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewTransactionSheetStore } from '@/features/transactions/stores/use-new-transaction-store';

import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { UploadTransactions } from '@/app/(dashboard)/transactions/_components/upload-transactions/upload-transactions';
import { UploadResults } from '@/app/(dashboard)/transactions/_components/upload-transactions/upload-transactions.type';
import { ImportCard } from '@/app/(dashboard)/transactions/_components/import-card/import-card';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export default function TransactionsPage() {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState<UploadResults>({ data: [], erros: [], meta: {} });

  const { onOpen } = useNewTransactionSheetStore();
  const transactionsQuery = useGetTransactions();
  const bulkDeletetransactionsQuery = useBulkDeleteTransactions();

  const handleUpload = (results: UploadResults) => {
    setVariant(VARIANTS.IMPORT);
    setImportResults(results);
  };

  const onCancelUpload = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const isDisabled = transactionsQuery.isLoading || bulkDeletetransactionsQuery.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none dropd-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="animate-spin text-primary size-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ImportCard data={importResults.data} onCancel={onCancelUpload} onSubmit={() => {}} />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none dropd-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
          <div className="space-x-4">
            <UploadTransactions onUpload={handleUpload} />
            <Button onClick={onOpen}>
              <PlusIcon className="size-4 mr-1" /> Add new
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            data={transactionsQuery.data || []}
            columns={TransactionsDataTableColumns}
            onDelete={(rows) => {
              const ids = rows.map((item) => item.original.id);
              bulkDeletetransactionsQuery.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
