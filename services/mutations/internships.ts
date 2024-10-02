import { useInternships, useStudentInternships } from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

type AddInternshipParams = {
  id: string;
  role: string;
  field: string;
  mode: string;
  region: string;
  startDate: string;
  endDate: string;
  companyMentorEmail: string | null;
  companyName: string;
  companyAddress: string;
  internshipLetterUrl: string;
};

export const useAddInternship = ({
  studentId,
  collegeMentorId,
}: {
  studentId: string;
  collegeMentorId: string;
}) => {
  const { mutate } = useStudentInternships({
    studentId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addInternship = async ({
    id,
    role,
    field,
    mode,
    region,
    startDate,
    endDate,
    companyMentorEmail,
    companyName,
    companyAddress,
    internshipLetterUrl,
  }: AddInternshipParams) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: [
          ...currentData.data,
          {
            id,
            student_id: studentId,
            role,
            field,
            mode,
            region,
            start_date: startDate,
            end_date: endDate,
            company_mentor_email: companyMentorEmail,
            company_name: companyName,
            company_address: companyAddress,
            internship_letter_url: internshipLetterUrl,
            approved: false,
            college_mentor_id: collegeMentorId,
          },
        ],
      };
    }, false);

    try {
      const { data, error } = await supabase
        .from('internships')
        .insert([
          {
            id,
            student_id: studentId,
            role,
            field,
            mode,
            region,
            start_date: startDate,
            end_date: endDate,
            company_mentor_email: companyMentorEmail,
            company_name: companyName,
            company_address: companyAddress,
            internship_letter_url: internshipLetterUrl,
            approved: false,
            college_mentor_id: collegeMentorId,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Internship added successfully.');
    } catch (error) {
      toast.error('Failed to add internship.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    addInternship,
    isLoading,
  };
};

export const useUpdateCompanyMentorEmail = ({
  studentId,
}: {
  studentId: string;
}) => {
  const { mutate } = useStudentInternships({
    studentId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateCompanyMentorEmail = async (
    internshipId: string,
    companyMentorEmail: string
  ) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: currentData.data.map((internship) =>
          internship.id === internshipId
            ? {
                ...internship,
                company_mentor_email: companyMentorEmail,
              }
            : internship
        ),
      };
    }, false);

    try {
      const { error } = await supabase
        .from('internships')
        .update({
          company_mentor_email: companyMentorEmail,
        })
        .eq('id', internshipId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Company mentor email updated successfully.');
    } catch (error) {
      toast.error('Failed to update company mentor email.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    updateCompanyMentorEmail,
    isLoading,
  };
};

export const useAcceptOrRejectInternship = ({
  collegeMentorId,
}: {
  collegeMentorId: string;
}) => {
  const { mutate } = useInternships({
    collegeMentorId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const acceptOrRejectInternship = useCallback(
    async (internshipId: string, approved: boolean) => {
      setIsLoading(true);

      try {
        if (approved) {
          mutate((currentData) => {
            if (!currentData?.data) return undefined;

            return {
              ...currentData,
              data: currentData.data.map((internship) =>
                internship.id === internshipId
                  ? {
                      ...internship,
                      approved,
                    }
                  : internship
              ),
            };
          }, false);

          const { error } = await supabase
            .from('internships')
            .update({
              approved,
            })
            .eq('id', internshipId);

          if (error) {
            throw new Error(error.message);
          }
        } else {
          mutate((currentData) => {
            if (!currentData?.data) return undefined;

            return {
              ...currentData,
              data: currentData.data.filter(
                (internship) => internship.id !== internshipId
              ),
            };
          }, false);

          const { error } = await supabase
            .from('internships')
            .delete()
            .eq('id', internshipId);

          if (error) {
            throw new Error(error.message);
          }
        }

        toast.success(
          `Internship ${approved ? 'approved' : 'rejected'} successfully.`
        );
      } catch (error) {
        toast.error(`Failed to ${approved ? 'approve' : 'reject'} internship.`);
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return {
    acceptOrRejectInternship,
    isLoading,
  };
};
