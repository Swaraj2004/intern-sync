import {
  useAttendanceWithStudents,
  useInternshipAttendance,
} from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import uuid4 from 'uuid4';

const supabase = supabaseClient();

export const useUpsertAttendance = ({
  instituteId,
  departmentId,
  collegeMentorId,
  attendanceDate,
}: {
  instituteId: number;
  departmentId?: string;
  collegeMentorId?: string;
  attendanceDate: string;
}) => {
  const { mutate } = useAttendanceWithStudents({
    instituteId,
    departmentId: departmentId,
    collegeMentorId: collegeMentorId,
    attendanceDate,
  });
  const [isLoading, setIsLoading] = useState(false);

  const upsertAttendance = useCallback(
    async (
      actionType: 'insert' | 'update',
      studentId: string,
      internshipId: string,
      attendanceStatus: string,
      attendanceId?: string
    ) => {
      setIsLoading(true);

      if (actionType === 'insert') {
        mutate((currentData) => {
          if (!currentData?.data) return undefined;

          return {
            ...currentData,
            data: currentData.data.map((student) =>
              student.uid === studentId
                ? {
                    ...student,
                    attendance: [
                      ...student.attendance,
                      {
                        id: 'new',
                        status: attendanceStatus,
                        date: attendanceDate,
                      },
                    ],
                  }
                : student
            ),
          };
        }, false);

        try {
          const { error } = await supabase.from('attendance').insert([
            {
              date: attendanceDate,
              student_id: studentId,
              status: attendanceStatus,
              internship_id: internshipId,
            },
          ]);

          if (error) {
            throw new Error(error.message);
          }

          toast.success('Attendance added successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to add attendance.');
        } finally {
          mutate();
          setIsLoading(false);
        }
      } else if (actionType === 'update' && attendanceId) {
        mutate((currentData) => {
          if (!currentData?.data) return undefined;

          return {
            ...currentData,
            data: currentData.data.map((student) =>
              student.uid === studentId
                ? {
                    ...student,
                    attendance: student.attendance.map((attendance) =>
                      attendance.id === attendanceId
                        ? { ...attendance, status: attendanceStatus }
                        : attendance
                    ),
                  }
                : student
            ),
          };
        }, false);

        try {
          const { error } = await supabase
            .from('attendance')
            .update({ status: attendanceStatus })
            .eq('id', attendanceId)
            .single();

          if (error) {
            throw new Error(error.message);
          }

          toast.success('Attendance updated successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to update attendance.');
        } finally {
          mutate();
          setIsLoading(false);
        }
      }
    },
    [attendanceDate, mutate]
  );

  return {
    upsertAttendance,
    isLoading,
  };
};

export const useMarkCheckInAndModeAttendance = ({
  attendanceId,
  studentId,
  internshipId,
  attendanceDate,
}: {
  attendanceId?: string;
  studentId: string;
  internshipId: string;
  attendanceDate: string;
}) => {
  const { mutate } = useInternshipAttendance({
    internshipId,
    attendanceDate,
  });

  const [isLoading, setIsLoading] = useState(false);

  const markCheckInAndModeAttendance = useCallback(
    async (workFromHome?: boolean) => {
      setIsLoading(true);

      const utcDate = new Date();
      const utcHours = utcDate.getUTCHours().toString().padStart(2, '0');
      const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, '0');
      const utcTime = `${utcHours}:${utcMinutes}:00`;

      const uid = uuid4();

      mutate((currentData) => {
        if (!currentData?.data)
          return {
            data: {
              id: uid,
              date: attendanceDate,
              in_time: utcTime,
              out_time: null,
              work_from_home: workFromHome || false,
              status: null,
              student_id: studentId,
              internship_id: internshipId,
            },
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
          };

        return {
          ...currentData,
          data: {
            ...currentData.data,
            in_time: utcTime,
            work_from_home: workFromHome || false,
          },
        };
      }, false);

      try {
        const attId = attendanceId || uid;
        const { error } = await supabase.from('attendance').upsert([
          {
            id: attId,
            student_id: studentId,
            internship_id: internshipId,
            date: attendanceDate,
            in_time: utcTime,
            work_from_home: workFromHome,
            status: 'pending',
          },
        ]);

        if (error) {
          throw new Error(error.message);
        }

        toast.success('Check-in marked successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to mark check-in.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [attendanceDate, mutate, studentId, internshipId, attendanceId]
  );

  return {
    markCheckInAndModeAttendance,
    isLoading,
  };
};

export const useMarkCheckOutAttendance = ({
  attendanceId,
  studentId,
  internshipId,
  attendanceDate,
}: {
  attendanceId?: string;
  studentId: string;
  internshipId: string;
  attendanceDate: string;
}) => {
  const { mutate } = useInternshipAttendance({
    internshipId,
    attendanceDate,
  });

  const [isLoading, setIsLoading] = useState(false);

  const markCheckOutAttendance = useCallback(async () => {
    setIsLoading(true);

    const utcDate = new Date();
    const utcHours = utcDate.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, '0');
    const utcTime = `${utcHours}:${utcMinutes}:00`;

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: {
          ...currentData.data,
          out_time: utcTime,
        },
      };
    }, false);

    try {
      const attId = attendanceId || uuid4();
      const { error } = await supabase.from('attendance').upsert([
        {
          id: attId,
          student_id: studentId,
          internship_id: internshipId,
          date: attendanceDate,
          out_time: utcTime,
          status: 'pending',
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Check-out marked successfully.');
    } catch (error) {
      if (typeof error === 'string') toast.error(error);
      else toast.error('Failed to mark check-out.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  }, [attendanceDate, mutate, studentId, internshipId, attendanceId]);

  return {
    markCheckOutAttendance,
    isLoading,
  };
};
