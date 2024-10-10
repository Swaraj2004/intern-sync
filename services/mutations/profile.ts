import {
  useCollegeMentorProfile,
  useCompanyMentorProfile,
  useDepartmentProfile,
  useInstituteProfile,
  useStudentProfile,
} from '@/services/queries';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useUpdateInstituteProfile = ({ userId }: { userId: string }) => {
  const { mutate } = useInstituteProfile({
    userId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateInstituteProfile = useCallback(
    async (
      fullName: string,
      contact: number | null,
      instituteName: string,
      instituteAddress: string,
      instituteEmailDomain: string,
      studentEmailDomain: string
    ) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return currentData;
        return {
          ...currentData,
          data: {
            ...currentData.data,
            name: instituteName,
            address: instituteAddress,
            institute_email_domain: instituteEmailDomain,
            student_email_domain: studentEmailDomain,
            users: {
              name: fullName,
              email: currentData?.data?.users?.email ?? '',
              contact,
            },
          },
        };
      }, false);

      try {
        const { error } = await supabase
          .from('institutes')
          .update({
            name: instituteName,
            address: instituteAddress,
            institute_email_domain: instituteEmailDomain,
            student_email_domain: studentEmailDomain,
          })
          .eq('uid', userId);

        if (error) {
          throw error;
        }

        const { error: userError } = await supabase
          .from('users')
          .update({
            name: fullName,
            contact,
          })
          .eq('id', userId);

        if (userError) {
          throw userError;
        }

        toast.success('Profile updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        toast.error('Failed to update profile.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, userId]
  );

  return {
    updateInstituteProfile,
    isLoading,
  };
};

export const useUpdateDepartmentProfile = ({ userId }: { userId: string }) => {
  const { mutate } = useDepartmentProfile({
    userId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateDepartmentProfile = useCallback(
    async (fullName: string, contact: number) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return currentData;
        return {
          ...currentData,
          data: {
            ...currentData.data,
            users: {
              name: fullName,
              email: currentData?.data?.users?.email ?? '',
              contact,
            },
          },
        };
      }, false);

      try {
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: fullName,
            contact,
          })
          .eq('id', userId);

        if (userError) {
          throw userError;
        }

        toast.success('Profile updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        toast.error('Failed to update profile.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, userId]
  );

  return {
    updateDepartmentProfile,
    isLoading,
  };
};

export const useUpdateCollegeMentorProfile = ({
  userId,
}: {
  userId: string;
}) => {
  const { mutate } = useCollegeMentorProfile({
    userId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateCollegeMentorProfile = useCallback(
    async (fullName: string, contact: number) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return currentData;
        return {
          ...currentData,
          data: {
            ...currentData.data,
            users: {
              name: fullName,
              email: currentData?.data?.users?.email ?? '',
              contact,
            },
          },
        };
      }, false);

      try {
        const { error: userError } = await supabase
          .from('users')
          .update({
            name: fullName,
            contact,
          })
          .eq('id', userId);

        if (userError) {
          throw userError;
        }

        toast.success('Profile updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        toast.error('Failed to update profile.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, userId]
  );

  return {
    updateCollegeMentorProfile,
    isLoading,
  };
};

export const useUpdateCompanyMentorProfile = ({
  userId,
}: {
  userId: string;
}) => {
  const { mutate } = useCompanyMentorProfile({
    userId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateCompanyMentorProfile = useCallback(
    async (
      fullName: string,
      contact: number,
      designation: string,
      company_name: string,
      company_address: string,
      company_latitude: number,
      company_longitude: number,
      company_radius: number
    ) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return currentData;
        return {
          ...currentData,
          data: {
            ...currentData.data,
            designation,
            company_name,
            company_address,
            company_latitude,
            company_longitude,
            company_radius,
            users: {
              name: fullName,
              email: currentData?.data?.users?.email ?? '',
              contact,
            },
          },
        };
      }, false);

      try {
        const { error } = await supabase
          .from('company_mentors')
          .update({
            designation,
            company_name,
            company_address,
            company_latitude,
            company_longitude,
            company_radius,
          })
          .eq('uid', userId);

        if (error) {
          throw error;
        }

        const { error: userError } = await supabase
          .from('users')
          .update({
            name: fullName,
            contact,
          })
          .eq('id', userId);

        if (userError) {
          throw userError;
        }

        toast.success('Profile updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        toast.error('Failed to update profile.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, userId]
  );

  return {
    updateCompanyMentorProfile,
    isLoading,
  };
};

export const useUpdateStudentProfile = ({ userId }: { userId: string }) => {
  const { mutate } = useStudentProfile({ userId });
  const [isLoading, setIsLoading] = useState(false);

  const updateStudentProfile = useCallback(
    async (
      dob: string | null,
      contact: number,
      address: string,
      admissionYear: number,
      division: string,
      rollNumber: string,
      admissionId: string
    ) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return currentData;
        return {
          ...currentData,
          data: {
            ...currentData.data,
            dob,
            address,
            admission_year: admissionYear,
            division,
            roll_no: rollNumber,
            admission_id: admissionId,
            users: {
              ...currentData.data.users,
              name: currentData.data.users?.name ?? '',
              email: currentData.data.users?.email ?? '',
              contact,
            },
          },
        };
      }, false);

      try {
        const { error: studentError } = await supabase
          .from('students')
          .update({
            dob,
            address,
            admission_year: admissionYear,
            division,
            roll_no: rollNumber,
            admission_id: admissionId,
          })
          .eq('uid', userId);

        if (studentError) {
          throw studentError;
        }

        const { error: userError } = await supabase
          .from('users')
          .update({
            contact,
          })
          .eq('id', userId);

        if (userError) {
          throw userError;
        }

        toast.success('Profile updated successfully.');
      } catch (error) {
        toast.error('Failed to update profile.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, userId]
  );

  return {
    updateStudentProfile,
    isLoading,
  };
};
