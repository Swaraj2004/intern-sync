'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type ReportsDateContextType = {
  reportsDate: Date;
  setReportsDate: (date: Date) => void;
};

const ReportsDateContext = createContext<ReportsDateContextType | undefined>(
  undefined
);

export const ReportsDateProvider = ({ children }: { children: ReactNode }) => {
  const [reportsDate, setReportsDate] = useState(new Date());

  return (
    <ReportsDateContext.Provider value={{ reportsDate, setReportsDate }}>
      {children}
    </ReportsDateContext.Provider>
  );
};

export const useReportsDate = () => {
  const context = useContext(ReportsDateContext);
  if (!context) {
    throw new Error(
      'useReportsDate must be used within an ReportsDateProvider'
    );
  }
  return context;
};
