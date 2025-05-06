import { ImportTableHeadSelect } from '@/app/(dashboard)/transactions/_components/import-card/import-table/table-head-select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
};

export function ImportTablePreview({ headers, body, selectedColumns, onTableHeadSelectChange }: Props) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            {headers.map((_item, index) => (
              <TableHead key={index}>
                <ImportTableHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onChange={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {row.map((cell, index) => (
                <TableCell key={index} className="font-medium pl-4">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
