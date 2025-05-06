'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriesDataTableColumns } from './_components/table/columns';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { Loader2, PlusIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewCategoryStore } from '@/features/categories/hooks/use-new-category-store';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';

export default function CategoriesPage() {
  const { onOpen } = useNewCategoryStore();
  const categoriesQuery = useGetCategories();

  const bulkDeleteCategoriesQuery = useBulkDeleteCategories();

  const isDisabled = categoriesQuery.isLoading || bulkDeleteCategoriesQuery.isPending;

  if (categoriesQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
          <Button onClick={onOpen}>
            <PlusIcon className="size-4 mr-1" /> Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            data={categoriesQuery.data || []}
            columns={CategoriesDataTableColumns}
            onDelete={(rows) => {
              const ids = rows.map((item) => item.original.id);
              bulkDeleteCategoriesQuery.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}
