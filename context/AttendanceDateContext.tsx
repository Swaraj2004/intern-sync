'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type AttendanceDateContextType = {
  attendanceDate: Date;
  setAttendanceDate: (date: Date) => void;
};

const AttendanceDateContext = createContext<
  AttendanceDateContextType | undefined
>(undefined);

export const AttendanceDateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [attendanceDate, setAttendanceDate] = useState(new Date());

  return (
    <AttendanceDateContext.Provider
      value={{ attendanceDate, setAttendanceDate }}
    >
      {children}
    </AttendanceDateContext.Provider>
  );
};

export const useAttendanceDate = () => {
  const context = useContext(AttendanceDateContext);
  if (!context) {
    throw new Error(
      'useAttendanceDate must be used within an AttendanceDateProvider'
    );
  }
  return context;
};
