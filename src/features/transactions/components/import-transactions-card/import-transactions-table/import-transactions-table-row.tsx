import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  row: string[];
  rowIndex: number;
  cellHasError: (rowIndex: number, columnIndex: number) => boolean;
  isCellAccepted: (rowIndex: number, columnIndex: number) => boolean;
} & React.ComponentProps<'tr'>;

export const ImportTransactionsTableRow = React.memo(
  ({ row, rowIndex, cellHasError, isCellAccepted, ...trProps }: Props) => {
    return (
      <TableRow {...trProps}>
        {row.map((cell, columnIndex) => (
          <TableCell
            key={`${rowIndex}/${columnIndex}`}
            className={cn(
              'font-medium pl-4',
              cellHasError(rowIndex, columnIndex) ? 'bg-destructive/10' : '',
              isCellAccepted(rowIndex, columnIndex) ? 'bg-green-600/10' : '',
            )}
          >
            {cell}
          </TableCell>
        ))}
      </TableRow>
    );
  },
);
