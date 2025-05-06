'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { InferResponseType } from 'hono';
import { rpcClient } from '@/lib/hono';
import { Actions } from './actions';
import { format } from 'date-fns';
import { convertAmountFromMiliUnits, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AccountColumnCell } from '@/app/(dashboard)/transactions/_components/table/account-column-cell';
import { CategoryColumnCell } from '@/app/(dashboard)/transactions/_components/table/category-column-cell';

export type ColumnType = InferResponseType<typeof rpcClient.api.transactions.$get, 200>['data'][0];

export const TransactionsDataTableColumns: ColumnDef<ColumnType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return <span className="pl-3">{format(date, 'dd MMM, yyyy')}</span>;
    },
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <CategoryColumnCell
          transactionId={row.original.id}
          category={row.original.category}
          categoryId={row.original.categoryId}
        />
      );
    },
  },
  {
    id: 'payee',
    accessorKey: 'payee',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="pl-3">{row.original.payee}</span>;
    },
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.amount));
      return (
        <Badge variant={amount < 0 ? 'expense' : 'income'} className="pl-3 text-xs font-medium px-3.5 py-2 rounded-lg">
          {formatCurrency(convertAmountFromMiliUnits(amount))}
        </Badge>
      );
    },
  },
  {
    id: 'account',
    accessorKey: 'account',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <AccountColumnCell account={row.original.account} accountId={row.original.accountId} />;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
