import { useInstituteProfile } from '@/services/queries';
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
          .match({ uid: userId });

        if (error) {
          throw error;
        }

        const { error: userError } = await supabase
          .from('users')
          .update({
            name: fullName,
            contact,
          })
          .match({ id: userId });

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
    updateInstituteProfile,
    isLoading,
  };
};
