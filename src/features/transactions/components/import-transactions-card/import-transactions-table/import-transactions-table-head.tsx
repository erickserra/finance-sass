import { TableHead } from '@/components/ui/table';
import { ImportTransactionsTableHeadSelect } from '@/features/transactions/components/import-transactions-card/import-transactions-table/import-transactions-table-head-select';
import React from 'react';

type Props = {
  selectedColumns: Record<string, string | null>;
  columnIndex: number;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export const ImportTransactionsTableHead = React.memo(
  ({ selectedColumns, columnIndex, onTableHeadSelectChange }: Props) => {
    return (
      <TableHead>
        <ImportTransactionsTableHeadSelect
          columnIndex={columnIndex}
          selectedColumns={selectedColumns}
          onChange={onTableHeadSelectChange}
        />
      </TableHead>
    );
  },
);
