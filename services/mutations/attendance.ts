import { useAttendanceWithStudents } from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

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
              student_id: studentId,
              status: attendanceStatus,
              date: attendanceDate,
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
