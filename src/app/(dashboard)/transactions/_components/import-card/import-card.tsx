import { requiredColumns } from '@/app/(dashboard)/transactions/_components/import-card/import-card.const';
import { ImportTablePreview } from '@/app/(dashboard)/transactions/_components/import-card/import-table/import-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export function ImportCard({ data, onCancel, onSubmit }: Props) {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const headers = data[0];
  const body = data.slice(1);
  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((prev) => {
      const currentSelectedColumns = { ...prev };

      let newColumnValue = value === 'skip' ? null : value;

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
    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null) ? [] : transformedRow;
        })
        .filter((row) => row.length > 0),
    };
  };

  return (
    <Card className="border-none dropd-shadow-sm">
      <CardHeader className="gap-y-2 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Import Transaction</CardTitle>
        <div className="flex items-center gap-4">
          <Button onClick={onCancel} variant="destructive">
            <X className="size-4 mr-1" /> Cancel
          </Button>
          <Button disabled={progress < requiredColumns.length} onClick={() => {}}>
            Continue ({progress} / {requiredColumns.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTablePreview
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={onTableHeadSelectChange}
        />
      </CardContent>
    </Card>
  );
}
