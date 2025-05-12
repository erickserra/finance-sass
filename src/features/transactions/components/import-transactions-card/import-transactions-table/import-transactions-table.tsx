import { TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { ImportTransactionsTableHead } from '@/features/transactions/components/import-transactions-card/import-transactions-table/import-transactions-table-head';
import { ImportTransactionsTableRow } from '@/features/transactions/components/import-transactions-card/import-transactions-table/import-transactions-table-row';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useRef } from 'react';

type Props = {
  headers: string[];
  body: string[][];
  rowErrors: Record<string, number[]>;
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export function ImportTransactionsTable({ headers, body, selectedColumns, onTableHeadSelectChange, rowErrors }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const cellHasError = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const isTheColumnSelected = selectedColumns[`column_${columnIndex}`] ?? null;
      if (!isTheColumnSelected) return false;

      const errorKey = `row_${rowIndex}`;
      if (!rowErrors?.[errorKey]) return false;
      return rowErrors[errorKey].includes(columnIndex);
    },
    [rowErrors, selectedColumns],
  );

  const isCellAccepted = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (!Object.keys(rowErrors).length) return false;

      const isTheColumnSelected = selectedColumns[`column_${columnIndex}`] ?? null;
      if (!isTheColumnSelected) return false;

      return !cellHasError(rowIndex, columnIndex);
    },
    [rowErrors, selectedColumns, cellHasError],
  );

  const virtualizer = useVirtualizer({
    count: body.length,
    getScrollElement: () => wrapperRef.current,
    estimateSize: () => 38,
    overscan: 10,
  });

  return (
    <div className="rounded-md border overflow-auto max-h-[calc(100vh-500px)]" ref={wrapperRef}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table data-slot="table" className="w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow>
              {headers.map((_item, index) => (
                <ImportTransactionsTableHead
                  key={`table-head-${index}`}
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onTableHeadSelectChange={onTableHeadSelectChange}
                />
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = body[virtualRow.index];
              return (
                <ImportTransactionsTableRow
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                  }}
                  key={`row-${index}`}
                  row={row}
                  rowIndex={virtualRow.index}
                  cellHasError={cellHasError}
                  isCellAccepted={isCellAccepted}
                />
              );
            })}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
