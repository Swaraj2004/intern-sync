import { useAttendanceWithStudents } from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useUpdateAttendance = ({
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
    departmentId: departmentId || undefined,
    collegeMentorId: collegeMentorId || undefined,
    attendanceDate,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateAttendance = async (
    attendanceId: string,
    studentId: string,
    attendanceStatus: string
  ) => {
    setIsLoading(true);

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
      const { data, error } = await supabase
        .from('attendance')
        .update({ status: attendanceStatus })
        .eq('id', attendanceId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        toast.success('Attendance approved successfully');
      }
    } catch (error) {
      if (typeof error === 'string') toast.error(error);
      else toast.error('Failed to approve attendance');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    updateAttendance,
    isLoading,
  };
};
