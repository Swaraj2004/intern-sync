import { convertUTCtoIST } from '@/lib/utils';
import { useDailyReport, useReportsWithStudents } from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddDailyReport = ({
  attendanceId,
  studentId,
  internshipId,
}: {
  attendanceId: string;
  studentId: string;
  internshipId: string;
}) => {
  const currentUTCDate = new Date().toISOString();
  const currentISTDate = new Date(convertUTCtoIST(currentUTCDate));
  const { mutate } = useDailyReport({
    attendanceId,
    reportDate: currentISTDate.toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);

  const addDailyReport = useCallback(
    async (division: string, details: string, main_points: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;

        return {
          ...currentData,
          data: {
            ...currentData.data,
            internship_reports: {
              division,
              details,
              main_points,
              status: 'pending',
              feedback: null,
            },
          },
        };
      }, false);

      try {
        const { error } = await supabase.from('internship_reports').upsert([
          {
            id: attendanceId,
            division,
            details,
            main_points,
            status: 'pending',
            student_id: studentId,
            internship_id: internshipId,
          },
        ]);

        if (error) {
          throw new Error(error.message);
        }

        toast.success('Daily report added successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to add report.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [attendanceId, studentId, internshipId, mutate]
  );

  return { addDailyReport, isLoading };
};

export const useApproveReport = ({
  instituteId,
  reportDate,
  departmentId,
  collegeMentorId,
}: {
  instituteId: string;
  reportDate: string;
  departmentId?: string;
  collegeMentorId?: string;
}) => {
  const { mutate } = useReportsWithStudents({
    instituteId,
    reportDate,
    departmentId,
    collegeMentorId,
  });

  const [isLoading, setIsLoading] = useState(false);

  const approveReport = useCallback(
    async (
      actionType: 'approved' | 'revision',
      attendanceId: string,
      studentId: string,
      feedback: string
    ) => {
      setIsLoading(true);

      if (actionType === 'approved') {
        mutate((currentData) => {
          if (!currentData?.data) return undefined;

          return {
            ...currentData,
            data: currentData.data.map((studentReport) => {
              if (studentReport.student_uid === studentId) {
                return {
                  ...studentReport,
                  report_status: 'approved',
                };
              }

              return studentReport;
            }),
          };
        }, false);

        try {
          const { error } = await supabase
            .from('internship_reports')
            .update({
              feedback,
              status: 'approved',
            })
            .eq('id', attendanceId);

          if (error) {
            throw new Error(error.message);
          }

          toast.success('Report approved successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to approve report.');
        } finally {
          mutate();
          setIsLoading(false);
        }
      } else if (actionType === 'revision') {
        mutate((currentData) => {
          if (!currentData?.data) return undefined;

          return {
            ...currentData,
            data: currentData.data.map((studentReport) => {
              if (studentReport.student_uid === studentId) {
                return {
                  ...studentReport,
                  report_status: 'revision',
                };
              }

              return studentReport;
            }),
          };
        }, false);

        try {
          const { error } = await supabase
            .from('internship_reports')
            .update({
              feedback,
              status: 'revision',
            })
            .eq('id', attendanceId);

          if (error) {
            throw new Error(error.message);
          }

          toast.success('Report sent for revision successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to send report for revision.');
        } finally {
          mutate();
          setIsLoading(false);
        }
      }
    },
    [mutate]
  );

  return { approveReport, isLoading };
};
