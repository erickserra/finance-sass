'use client';

import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountsDataTableColumns } from './_components/table/columns';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { Loader2, PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountsPage() {
  const { onOpen } = useNewAccount();
  const accountsQuery = useGetAccounts();

  const bulkDeleteAccountsQuery = useBulkDeleteAccounts();

  const isDisabled = accountsQuery.isLoading || bulkDeleteAccountsQuery.isPending;

  if (accountsQuery.isLoading) {
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none dropd-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={onOpen}>
            <PlusIcon className="size-4 mr-1" /> Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            data={accountsQuery.data || []}
            columns={AccountsDataTableColumns}
            onDelete={(rows) => {
              const ids = rows.map((item) => item.original.id);
              bulkDeleteAccountsQuery.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
