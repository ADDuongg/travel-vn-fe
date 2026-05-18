'use client';

import { AiFillCalendar } from 'react-icons/ai';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import * as I from '@/types/commons';

export interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  size?: I.ComponentSize;
}
const datePickerVariants = cva('', {
  variants: {
    size: {
      sm: 'h-8 ',
      md: 'h-9 ',
      lg: 'h-14 ',
      xl: 'h-18 ',
    },
  },
});

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
  size = 'md',
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            datePickerVariants({ size }),
            'w-full pl-3 text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          {value ? format(value, 'yyyy-MM-dd') : <span>{placeholder}</span>}
          <AiFillCalendar className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

