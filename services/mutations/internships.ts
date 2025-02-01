import {
  useInternshipDetails,
  useInternships,
  useStudentInternships,
} from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
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

type UpdateInternshipParams = {
  internshipId: string;
  role: string;
  field: string;
  mode: string;
  startDate: string;
  endDate: string;
  companyMentorEmail: string | null;
  companyName: string;
  companyAddress: string;
};

export const useAddInternship = ({
  studentId,
  collegeMentorId,
  departmentId,
  instituteId,
}: {
  studentId: string;
  collegeMentorId: string;
  departmentId: string;
  instituteId: string;
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
            department_id: departmentId,
            institute_id: instituteId,
          },
        ],
      };
    }, false);

    try {
      const { error } = await supabase.from('internships').insert([
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
          department_id: departmentId,
          institute_id: instituteId,
        },
      ]);

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

export const useUpdateInternship = ({
  internshipId,
}: {
  internshipId: string;
}) => {
  const { mutate } = useInternshipDetails({
    internshipId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateInternship = async ({
    internshipId,
    role,
    field,
    mode,
    startDate,
    endDate,
    companyMentorEmail,
    companyName,
    companyAddress,
  }: UpdateInternshipParams) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: {
          ...currentData.data,
          role,
          field,
          mode,
          start_date: startDate,
          end_date: endDate,
          company_mentor_email: companyMentorEmail,
          company_name: companyName,
          company_address: companyAddress,
        },
      };
    }, false);

    try {
      const { error } = await supabase
        .from('internships')
        .update({
          role,
          field,
          mode,
          start_date: startDate,
          end_date: endDate,
          company_mentor_email: companyMentorEmail,
          company_name: companyName,
          company_address: companyAddress,
        })
        .eq('id', internshipId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Internship updated successfully.');
    } catch (error) {
      toast.error('Failed to update internship.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    updateInternship,
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
  instituteId,
  departmentId,
  collegeMentorId,
}: {
  instituteId: string;
  departmentId?: string;
  collegeMentorId?: string;
}) => {
  const { mutate } = useInternships({
    instituteId,
    departmentId,
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

export const useAssignCompanyMentor = ({
  companyMentorEmail,
  internshipId,
}: {
  companyMentorEmail: string;
  internshipId: string;
}) => {
  const { mutate } = useInternshipDetails({
    internshipId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const assignCompanyMentor = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, roles (name)')
        .eq('email', companyMentorEmail)
        .eq('roles.name', 'company-mentor')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const { error: assignCompanyMentorError } = await supabase
        .from('internships')
        .update({
          company_mentor_id: data.id,
        })
        .eq('id', internshipId);

      if (assignCompanyMentorError) {
        throw new Error(assignCompanyMentorError.message);
      }

      toast.success('Company mentor assigned successfully.');
    } catch (error) {
      toast.error('Failed to assign company mentor.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    assignCompanyMentor,
    isLoading,
  };
};

export const useAddHomeCoordinates = ({
  internshipId,
  studentId,
}: {
  internshipId: string;
  studentId: string;
}) => {
  const { mutate } = useInternshipDetails({
    internshipId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addHomeCoordinates = async (
    latitude: number,
    longitude: number,
    radius: number
  ) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: {
          ...currentData.data,
          student_home_latitude: latitude,
          student_home_longitude: longitude,
          student_home_radius: radius,
        },
      };
    }, false);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          home_latitude: latitude,
          home_longitude: longitude,
          home_radius: radius,
        })
        .eq('uid', studentId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Home coordinates added successfully.');
    } catch (error) {
      toast.error('Failed to add home coordinates.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    addHomeCoordinates,
    isLoading,
  };
};
