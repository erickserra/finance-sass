import ReactCurrencyInputField from 'react-currency-input-field';
import { Info, MinusCircle, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
};

export function CurrencyInput({ value, onChange, placeholder, disabled, isError = false }: Props) {
  const parsedValue = parseFloat(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const reversedValue = parseFloat(value) * -1;
    onChange(reversedValue.toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                'bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition',
                isIncome ? 'bg-emerald-500 hover:bg-emerald-600' : '',
                isExpense ? 'bg-rose-500 hover:bg-rose-600' : '',
              )}
            >
              {!parsedValue ? <Info className="size-3 text-white" /> : null}
              {isIncome ? <PlusCircle className="size-3 text-white" /> : null}
              {isExpense ? <MinusCircle className="size-3 text-white" /> : null}
            </button>
          </TooltipTrigger>
          <TooltipContent>Use [+] for income and [-] for expenses</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ReactCurrencyInputField
        prefix="$"
        aria-invalid={isError}
        className={cn(
          'pl-10 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent pr-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        )}
        decimalScale={2}
        decimalsLimit={2}
        value={value}
        placeholder={placeholder}
        onValueChange={onChange}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground mt-2">
        {isIncome ? 'This will count as an income' : null}
        {isExpense ? 'This will count as an expense' : null}
      </p>
    </div>
  );
}
