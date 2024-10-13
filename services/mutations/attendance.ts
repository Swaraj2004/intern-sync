import {
  useAttendanceWithStudents,
  useAttendanceWithStudentsForCompanyMentor,
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
  instituteId: string;
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
      attendanceId: string | null
    ) => {
      setIsLoading(true);

      if (actionType === 'insert') {
        mutate((currentData) => {
          if (!currentData?.data) return undefined;

          return {
            ...currentData,
            data: currentData.data.map((student) =>
              student.student_uid === studentId
                ? {
                    ...student,
                    attendance_id: uuid4(),
                    attendance_status: attendanceStatus,
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
        } catch (error: any) {
          if (typeof error.message === 'string') toast.error(error.message);
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
              student.student_uid === studentId
                ? {
                    ...student,
                    attendance_status: attendanceStatus,
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
        } catch (error: any) {
          if (typeof error.message === 'string') toast.error(error.message);
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

export const useApproveAttendance = ({
  companyMentorId,
  attendanceDate,
}: {
  companyMentorId: string;
  attendanceDate: string;
}) => {
  const { mutate } = useAttendanceWithStudentsForCompanyMentor({
    companyMentorId,
    attendanceDate,
  });

  const [isLoading, setIsLoading] = useState(false);

  const approveAttendance = useCallback(
    async (attendanceId: string, attendanceStatus: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;

        return {
          ...currentData,
          data: currentData.data.map((student) =>
            student.attendance_id === attendanceId
              ? {
                  ...student,
                  attendance_status: attendanceStatus,
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

        toast.success('Attendance approved successfully.');
      } catch (error: any) {
        if (typeof error.message === 'string') toast.error(error.message);
        else toast.error('Failed to approve attendance.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return {
    approveAttendance,
    isLoading,
  };
};

export const useMarkAttendance = ({
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

  const markAttendance = useCallback(
    async (
      workFromHome: boolean,
      latitude: number,
      longitude: number,
      isCheckOut: boolean = false
    ) => {
      setIsLoading(true);

      const utcDate = new Date();
      const utcHours = utcDate.getUTCHours().toString().padStart(2, '0');
      const utcMinutes = utcDate.getUTCMinutes().toString().padStart(2, '0');
      const utcTime = `${utcHours}:${utcMinutes}:00`;

      const uid = attendanceId || uuid4();

      try {
        const { error } = await supabase.rpc('mark_attendance', {
          attendance_id: uid,
          student_id: studentId,
          internship_id: internshipId,
          attendance_date: attendanceDate,
          check_time: utcTime,
          work_from_home: workFromHome,
          latitude,
          longitude,
          is_check_out: isCheckOut,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success(
          isCheckOut
            ? 'Check-out marked successfully.'
            : 'Check-in marked successfully.'
        );
      } catch (error: any) {
        if (typeof error.message === 'string') toast.error(error.message);
        else toast.error('Failed to mark attendance.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [attendanceDate, mutate, studentId, internshipId, attendanceId]
  );

  return {
    markAttendance,
    isLoading,
  };
};
