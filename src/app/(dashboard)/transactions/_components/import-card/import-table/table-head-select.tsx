import { requiredColumns } from '@/app/(dashboard)/transactions/_components/import-card/import-card.const';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

export function ImportTableHeadSelect({ columnIndex, selectedColumns, onChange }: Props) {
  const currentSelection = selectedColumns?.[`column_${columnIndex}`] ?? null;

  return (
    <div>
      <Select value={currentSelection || ''} onValueChange={(value) => onChange(columnIndex, value)}>
        <SelectTrigger
          className={cn(
            'focus-ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize',
            currentSelection ? 'text-primary' : '',
          )}
        >
          <SelectValue placeholder="Skip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="skip">Skip</SelectItem>
          {requiredColumns.map((option, index) => {
            const disabled =
              Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option;

            return (
              <SelectItem key={index} value={option} disabled={disabled} className="capitalize">
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
