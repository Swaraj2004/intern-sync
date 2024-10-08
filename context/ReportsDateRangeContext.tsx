'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type DateRange = {
  from: Date;
  to: Date;
};

type ReportsDateRangeContextType = {
  reportsDateRange: DateRange;
  setReportsDateRange: (range: DateRange) => void;
};

const ReportsDateRangeContext = createContext<
  ReportsDateRangeContextType | undefined
>(undefined);

export const ReportsDateRangeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [reportsDateRange, setReportsDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 6)),
    to: new Date(),
  });

  return (
    <ReportsDateRangeContext.Provider
      value={{ reportsDateRange, setReportsDateRange }}
    >
      {children}
    </ReportsDateRangeContext.Provider>
  );
};

export const useReportsDateRange = () => {
  const context = useContext(ReportsDateRangeContext);
  if (!context) {
    throw new Error(
      'useReportsDateRange must be used within a ReportsDateRangeProvider'
    );
  }
  return context;
};
