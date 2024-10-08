'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  isToday as _isToday,
  CalendarDate,
  createCalendar,
  fromDate,
  getLocalTimeZone,
  getWeeksInMonth,
  parseDateTime,
  toCalendarDate,
  toCalendarDateTime,
} from '@internationalized/date';
import { I18nProvider } from '@react-aria/i18n';
import { DateSegment as IDateSegment } from '@react-stately/datepicker';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  X,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AriaDatePickerProps,
  AriaTimeFieldProps,
  CalendarProps,
  DateValue,
  TimeValue,
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDateField,
  useDatePicker,
  useDateSegment,
  useLocale,
  useTimeField,
} from 'react-aria';
import {
  CalendarState,
  DateFieldState,
  DatePickerState,
  DatePickerStateOptions,
  TimeFieldStateOptions,
  useCalendarState,
  useDateFieldState,
  useDatePickerState,
  useTimeFieldState,
} from 'react-stately';

function Calendar(props: CalendarProps<DateValue>) {
  const prevButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });
  const {
    calendarProps,
    prevButtonProps: _prevButtonProps,
    nextButtonProps: _nextButtonProps,
    title,
  } = useCalendar(props, state);
  const { buttonProps: prevButtonProps } = useButton(
    _prevButtonProps,
    prevButtonRef
  );
  const { buttonProps: nextButtonProps } = useButton(
    _nextButtonProps,
    nextButtonRef
  );

  const [currentDate, setCurrentDate] = React.useState(state.focusedDate);

  React.useEffect(() => {
    setCurrentDate(state.focusedDate);
  }, [state.focusedDate]);

  const years = Array.from(
    { length: 101 },
    (_, i) => currentDate.year - 50 + i
  );
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleYearChange = (year: string) => {
    const newDate = currentDate.set({ year: parseInt(year) });
    state.setFocusedDate(newDate);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = currentDate.set({ month: months.indexOf(month) + 1 });
    state.setFocusedDate(newDate);
    setCurrentDate(newDate);
  };

  return (
    <div {...calendarProps} className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between px-1">
          <Select
            value={months[currentDate.month - 1]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[125px] px-2.5 py-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-80">
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <Select
            value={currentDate.year.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px] px-2.5 py-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-80">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex items-center justify-between pt-1 px-1">
          <Button
            {...prevButtonProps}
            ref={prevButtonRef}
            variant="outline"
            className={cn(
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            )}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {months[currentDate.month - 1]} {currentDate.year}
          </div>
          <Button
            {...nextButtonProps}
            ref={nextButtonRef}
            variant="outline"
            className={cn(
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            )}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

interface CalendarGridProps {
  state: CalendarState;
}

function CalendarGrid({ state, ...props }: CalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table
      {...gridProps}
      className={cn(gridProps.className, 'w-full border-collapse space-y-1')}
    >
      <thead {...headerProps}>
        <tr className="flex">
          {weekDays.map((day, index) => (
            <th
              className="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
              key={index}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(weeksInMonth)].map((_, weekIndex) => (
          <tr className="mt-2 flex w-full" key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface CalendarCellProps {
  state: CalendarState;
  date: CalendarDate;
}

function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isToday = useMemo(() => {
    const timezone = getLocalTimeZone();
    return _isToday(date, timezone);
  }, [date]);

  return (
    <td
      {...cellProps}
      className={cn(
        cellProps.className,
        'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
      )}
    >
      <Button
        {...buttonProps}
        type="button"
        variant="ghost"
        ref={ref}
        className={cn(
          buttonProps.className,
          'h-9 w-9',
          isToday && 'bg-accent text-accent-foreground',
          isSelected &&
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          isOutsideVisibleRange && 'text-muted-foreground opacity-50',
          isDisabled && 'text-muted-foreground opacity-50'
        )}
      >
        {formattedDate}
      </Button>
    </td>
  );
}

interface DateSegmentProps {
  segment: IDateSegment;
  state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: { ...segmentProps },
  } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        'focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none',
        segment.type !== 'literal' && 'px-[1px]',
        segment.isPlaceholder && 'text-muted-foreground'
      )}
    >
      {segment.text}
    </div>
  );
}

function DateField(props: AriaDatePickerProps<DateValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        'inline-flex h-10 flex-1 items-center rounded-l-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.isDisabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
      {state.isInvalid && <span aria-hidden="true">🚫</span>}
    </div>
  );
}

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });
  const {
    fieldProps: { ...fieldProps },
    labelProps,
  } = useTimeField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        'inline-flex h-10 w-full flex-1 rounded-md border-2 border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.isDisabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

const TimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, 'locale'>
>((props, forwardedRef) => {
  return <TimeField {...props} />;
});

TimePicker.displayName = 'TimePicker';

export type DateTimePickerRef = {
  divRef: HTMLDivElement | null;
  buttonRef: HTMLButtonElement | null;
  contentRef: HTMLDivElement | null;
  jsDate: Date | null;
  state: DatePickerState;
};

const DateTimePicker = React.forwardRef<
  DateTimePickerRef,
  DatePickerStateOptions<DateValue> & {
    jsDate?: Date | null;
    onJsDateChange?: (date: Date | undefined) => void;
    showClearButton?: boolean;
    className?: string;
  }
>(
  (
    { jsDate, onJsDateChange, showClearButton = true, className, ...props },
    ref
  ) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [jsDatetime, setJsDatetime] = useState(jsDate || null);

    const state = useDatePickerState(props);

    useImperativeHandle(ref, () => ({
      divRef: divRef.current,
      buttonRef: buttonRef.current,
      contentRef: contentRef.current,
      jsDate: jsDatetime,
      state,
    }));
    const {
      groupProps,
      fieldProps,
      buttonProps: _buttonProps,
      dialogProps,
      calendarProps,
    } = useDatePicker(props, state, divRef);
    const { buttonProps } = useButton(_buttonProps, buttonRef);

    const currentValue = useCallback(() => {
      if (!jsDatetime) {
        return null;
      }

      const parsed = fromDate(jsDatetime, getLocalTimeZone());

      if (state.hasTime) {
        return toCalendarDateTime(parsed);
      }

      return toCalendarDate(parsed);
    }, [jsDatetime, state.hasTime]);

    useEffect(() => {
      /**
       * If user types datetime, it will be a null value until we get the correct datetime.
       * This is controlled by react-aria.
       **/
      if (state.value) {
        const date = parseDateTime(state.value.toString()).toDate(
          getLocalTimeZone()
        );
        setJsDatetime(date);
        onJsDateChange?.(date);
      }
    }, [state.value, onJsDateChange]);
    return (
      <I18nProvider locale="en-GB">
        <div
          {...groupProps}
          ref={divRef}
          className={cn(
            groupProps.className,
            className,
            'flex items-center rounded-md border-2 border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
          )}
        >
          <Popover open={props.isOpen} onOpenChange={props.onOpenChange}>
            <PopoverTrigger asChild>
              <Button
                {...buttonProps}
                variant="ghost"
                className="border-r-2 border-input py-1 px-3"
                disabled={props.isDisabled}
                onClick={() => {
                  state.setOpen(true);
                }}
              >
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent ref={contentRef} align="start" className="w-full">
              <div {...dialogProps} className="space-y-3">
                <Calendar {...calendarProps} />
                {state.hasTime && (
                  <TimeField
                    value={state.timeValue}
                    onChange={state.setTimeValue}
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
          <DateField {...fieldProps} value={currentValue()} />
          <div
            className={cn('-ml-2 mr-2 h-5 w-5', !showClearButton && 'hidden')}
          >
            <X
              className={cn(
                'h-5 w-5 cursor-pointer text-border',
                !jsDatetime && 'hidden'
              )}
              onClick={() => {
                setJsDatetime(null);
                onJsDateChange?.(undefined);
              }}
            />
          </div>
        </div>
      </I18nProvider>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker, TimePicker };
