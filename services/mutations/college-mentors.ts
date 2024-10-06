import deleteUserById from '@/server/delete-user';
import sendInviteEmail from '@/server/send-invite';
import { useCollegeMentors } from '@/services/queries';
import CollegeMentors from '@/types/college-mentors';
import { supabaseClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddCollegeMentor = ({
  userId,
  instituteId,
  departmentId,
}: {
  userId: string;
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useCollegeMentors({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const addCollegeMentor = async (
    mentorName: string,
    email: string,
    sendInvite: boolean,
    departmentId: string,
    departmentName?: string
  ) => {
    setIsLoading(true);

    const optimisticUpdate: CollegeMentors = {
      uid: crypto.randomUUID(),
      departments: {
        uid: departmentId,
        name: departmentName || '',
      },
      users: {
        id: crypto.randomUUID(),
        auth_id: null,
        name: mentorName,
        email,
        is_registered: sendInvite,
        is_verified: false,
      },
    };

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: [optimisticUpdate, ...currentData.data],
      };
    }, false);

    try {
      const { data, error } = await supabase.rpc('add_college_mentor', {
        mentor_name: mentorName,
        email,
        institute_id: instituteId,
        department_id: departmentId,
        requesting_user_id: userId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const result = data[0];

      if (result && !result.is_new_user && !result.has_role && result.auth_id) {
        toast.success('User already exists, assigned mentor role.');
      } else if (result && !result.is_verified && sendInvite) {
        const inviteData = await sendInviteEmail(email, result.user_id);

        if (inviteData) {
          await supabase
            .from('users')
            .update({ is_registered: true, auth_id: inviteData.user.id })
            .eq('id', result.user_id);
        }

        toast.success('College mentor added and invite sent.');
      } else {
        toast.success('College mentor added successfully.');
      }
    } catch (error) {
      toast.error('Failed to add mentor. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    addCollegeMentor,
    isLoading,
  };
};

export const useDeleteCollegeMentor = ({
  instituteId,
  departmentId,
  requestingUserId,
}: {
  instituteId: string;
  departmentId?: string;
  requestingUserId: string;
}) => {
  const { mutate } = useCollegeMentors({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const deleteCollegeMentor = async (userId: string, authId: string | null) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: currentData.data.filter((mentor) => mentor.uid !== userId),
      };
    }, false);

    try {
      const { data, error } = await supabase.rpc('delete_college_mentor', {
        user_id: userId,
        institute_id: instituteId,
        requesting_user_id: requestingUserId,
        department_id: departmentId,
      });

      if (error) {
        toast.error(error.details);
        return;
      }

      const result = data as { is_user_deleted: boolean } | null;

      if (authId && result && !result.is_user_deleted) {
        toast.success('College mentor role deleted successfully.');
      } else if (authId && result && result.is_user_deleted) {
        await deleteUserById(authId);
        toast.success('College mentor deleted successfully.');
      } else {
        toast.success('College mentor deleted successfully.');
      }
    } catch (error) {
      toast.error('Failed to delete mentor. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    deleteCollegeMentor,
    isLoading,
  };
};

export const useSendCollegeMentorInvite = ({
  instituteId,
  departmentId,
}: {
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useCollegeMentors({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (email: string, userId: string) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: currentData.data.map((mentor) =>
          mentor.uid === userId
            ? {
                ...mentor,
                users: mentor.users
                  ? { ...mentor.users, is_registered: true }
                  : mentor.users,
              }
            : mentor
        ),
      };
    }, false);

    try {
      const { user } = await sendInviteEmail(email, userId);

      await supabase
        .from('users')
        .update({ is_registered: true, auth_id: user.id })
        .eq('id', userId);

      toast.success('Invite email sent successfully.');
    } catch (error) {
      toast.error('Failed to send invite.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    isLoading,
  };
};
