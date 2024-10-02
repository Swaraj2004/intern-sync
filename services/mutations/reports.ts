import { useDailyReport } from '@/services/queries';
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
  const { mutate } = useDailyReport({
    attendanceId,
    reportDate: new Date().toISOString().split('T')[0],
  });

  const [isLoading, setIsLoading] = useState(false);

  const addDailyReport = useCallback(
    async (reportData: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;

        return {
          ...currentData,
          data: {
            ...currentData.data,
            report_data: reportData,
          },
        };
      }, false);

      try {
        const { error } = await supabase.from('internship_reports').insert([
          {
            id: attendanceId,
            report_data: reportData,
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
