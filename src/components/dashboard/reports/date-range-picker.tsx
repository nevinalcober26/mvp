'use client';

import * as React from 'react';
import { 
    addDays, 
    format, 
    startOfWeek, 
    endOfWeek, 
    startOfMonth, 
    endOfMonth, 
    subMonths, 
    startOfYear, 
    endOfYear, 
    subYears,
    isSameDay,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
}

const presets = [
    { label: 'Today', range: () => ({ from: new Date(), to: new Date() }) },
    { label: 'Yesterday', range: () => ({ from: addDays(new Date(), -1), to: addDays(new Date(), -1) }) },
    { label: 'This Week', range: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
    { label: 'Last Week', range: () => ({ from: startOfWeek(addDays(new Date(), -7)), to: endOfWeek(addDays(new Date(), -7)) }) },
    { label: 'This Month', range: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
    { label: 'Last Month', range: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
    { label: 'Last 7 Days', range: () => ({ from: addDays(new Date(), -6), to: new Date() }) },
    { label: 'Last 14 Days', range: () => ({ from: addDays(new Date(), -13), to: new Date() }) },
    { label: 'Last 30 Days', range: () => ({ from: addDays(new Date(), -29), to: new Date() }) },
    { label: 'Last 90 Days', range: () => ({ from: addDays(new Date(), -89), to: new Date() }) },
    { label: 'This Year', range: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
    { label: 'Last Year', range: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) }) },
];


export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handlePresetClick = (rangeFn: () => DateRange) => {
        onDateRangeChange(rangeFn());
        setIsOpen(false);
    };

    const displayLabel = React.useMemo(() => {
        if (!dateRange?.from) {
            return 'Pick a date range';
        }
        
        for (const preset of presets) {
            const presetRange = preset.range();
            if (dateRange.from && presetRange.from && isSameDay(dateRange.from, presetRange.from) &&
                dateRange.to && presetRange.to && isSameDay(dateRange.to, presetRange.to)) {
                return preset.label;
            }
        }

        if (dateRange.to) {
            return `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`;
        }

        return format(dateRange.from, 'LLL dd, y');

    }, [dateRange]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
            <div className="flex flex-col space-y-1 p-2 border-r">
                {presets.map((preset) => (
                    <Button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset.range)}
                        variant="ghost"
                        className="justify-start text-sm h-8 px-2"
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>
            <div className="p-0">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={onDateRangeChange}
                    numberOfMonths={2}
                />
            </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
