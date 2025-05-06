'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import { useMemo } from 'react';
import { SingleValue, SelectInstance } from 'react-select';
import Creatable from 'react-select/creatable';

type Props = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: Array<{ label: string; value: string }>;
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
  isError?: boolean;
};

export const Select = React.forwardRef<SelectInstance<{ label: string; value: string }>, Props>(
  (
    { onChange, onCreate, options = [], value = undefined, disabled = false, placeholder = '', isError = false },
    ref,
  ) => {
    const onSelect = (data: SingleValue<{ label: string; value: string }>) => {
      onChange(data?.value);
    };

    const formattedValue = useMemo(() => {
      return options.find((option) => option.value === value);
    }, [options, value]);

    return (
      <Creatable
        unstyled
        ref={ref}
        classNames={{
          clearIndicator: ({ isFocused }) =>
            cn(
              isFocused ? 'text-neutral-600' : 'text-neutral-200',
              'p-2',
              isFocused ? 'hover:text-neutral-800' : 'hover:text-neutral-400',
            ),
          control: ({ isDisabled, isFocused }) =>
            cn(
              'dark:bg-input/30 h-10 border shadow-xs rounded-md outline-none',
              isDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : '',
              isFocused ? 'border-ring ring-ring/50 ring-[3px]' : 'border-input ',
              isError ? 'ring-destructive/20 dark:ring-destructive/40 border-destructive' : '',
            ),
          dropdownIndicator: ({ isFocused }) =>
            cn(
              isFocused ? 'text-neutral-600' : 'text-neutral-200',
              'p-2',
              isFocused ? 'hover:text-neutral-800' : 'hover:text-neutral-400',
            ),
          // group: () => cn('py-2'),
          // groupHeading: () => cn('text-neutral-400', 'text-xs', 'font-medium', 'mb-1', 'px-3', 'uppercase'),
          // indicatorsContainer: () => classNames(),
          indicatorSeparator: ({ isDisabled }) => cn(isDisabled ? 'bg-neutral-100' : 'bg-input', 'my-2'),
          input: () => cn('m-0.5', 'py-0.5', 'text-base md:text-sm'),
          // loadingIndicator: ({ isFocused }) => cn(isFocused ? 'text-neutral-600' : 'text-neutral-200', 'p-2'),
          // loadingMessage: () => cn('text-neutral-400', 'py-2', 'px-3'),
          menu: () => cn('bg-popover border border-input text-popover-foreground text-sm rounded-md shadow-xs my-1'),
          menuList: () => cn('py-1 px-1'),
          // menuPortal: () => classNames(),
          // multiValue: () => cn('bg-neutral-100', 'rounded-sm', 'm-0.5'),
          // multiValueLabel: () => cn('rounded-sm', 'text-neutral-800', 'text-sm', 'p-[3]', 'pl-[6]'),
          // multiValueRemove: ({ isFocused }) =>
          //   cn('rounded-sm', isFocused && 'bg-red-500', 'px-1', 'hover:bg-red-500', 'hover:text-red-800'),
          noOptionsMessage: () => cn('text-neutral-400', 'py-2', 'px-3'),
          option: ({ isFocused, isSelected }) =>
            cn(
              'py-2 px-2 rounded-sm',
              isFocused ? 'bg-accent text-accent-foreground' : '',
              isSelected ? 'bg-primary/20' : '',
            ),
          placeholder: () => cn('text-muted-foreground text-base md:text-sm', 'mx-0.5'),
          singleValue: () => cn('text-base text-sm mx-0.5'),
          valueContainer: () => cn('py-0.5', 'px-2'),
        }}
        options={options}
        placeholder={placeholder}
        onChange={onSelect}
        onCreateOption={onCreate}
        value={formattedValue}
        isDisabled={disabled}
      />
    );
  },
);

Select.displayName = 'Select';
