'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const MONTHS = [
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
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MobileDatePickerCard = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const [displayMonth, setDisplayMonth] = useState(date.getMonth());
  const [displayYear, setDisplayYear] = useState(date.getFullYear());
  const [isOpen, setIsOpen] = useState(false);
  const yearSelectRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();

  const years = Array.from(
    { length: 11 },
    (_, i) => currentYear - 10 + i
  ).filter((year) => year <= currentYear);

  useEffect(() => {
    if (yearSelectRef.current) {
      const selectedYear = yearSelectRef.current.querySelector(
        '[aria-selected="true"]'
      );
      if (selectedYear) {
        selectedYear.scrollIntoView({ block: 'center' });
      }
    }
  }, [displayYear]);

  const handleDateClick = (day: number) => {
    const newDate = new Date(displayYear, displayMonth, day);
    if (newDate <= today) {
      setDate(newDate);
      setIsOpen(false);
    }
  };

  const handleMonthChange = (month: string) => {
    const newMonth = MONTHS.indexOf(month);
    setDisplayMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    setDisplayYear(parseInt(year));
  };

  const handlePrevMonth = () => {
    let newMonth = displayMonth - 1;
    let newYear = displayYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setDisplayMonth(newMonth);
    setDisplayYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = displayMonth + 1;
    let newYear = displayYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setDisplayMonth(newMonth);
    setDisplayYear(newYear);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
          onClick={() => setIsOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date.toDateString()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px]" align="start">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Select
            value={MONTHS[displayMonth]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue>{MONTHS[displayMonth]}</SelectValue>
            </SelectTrigger>
            <SelectContent className="h-[200px] overscroll-y-auto">
              {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={displayYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue>{displayYear}</SelectValue>
            </SelectTrigger>
            <SelectContent
              ref={yearSelectRef}
              className="h-[200px] overflow-y-auto"
            >
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const currentDate = new Date(displayYear, displayMonth, i + 1);
            const isDisabled = currentDate > today;
            return (
              <Button
                key={i + 1}
                variant={
                  date.getDate() === i + 1 &&
                  date.getMonth() === displayMonth &&
                  date.getFullYear() === displayYear
                    ? 'default'
                    : 'ghost'
                }
                className="w-8 h-8 p-0"
                disabled={isDisabled}
                onClick={() => handleDateClick(i + 1)}
              >
                {i + 1}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MobileDatePickerCard;
