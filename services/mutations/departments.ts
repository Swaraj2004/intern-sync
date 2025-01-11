import deleteUserById from '@/server/delete-user';
import sendInviteEmail from '@/server/send-invite';
import { useDepartments } from '@/services/queries';
import Departments from '@/types/departments';
import { supabaseClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddDepartment = ({
  instituteId,
  userId,
}: {
  instituteId: string;
  userId: string;
}) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addDepartment = async (
    departmentName: string,
    departmentCoordinatorName: string,
    email: string,
    sendInvite: boolean
  ) => {
    setIsLoading(true);

    const optimisticUpdate: Departments = {
      uid: crypto.randomUUID(),
      name: departmentName,
      users: {
        id: crypto.randomUUID(),
        auth_id: null,
        name: departmentCoordinatorName,
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
      const { data, error } = await supabase.rpc('add_department_coordinator', {
        institute_id: instituteId,
        department_name: departmentName,
        department_coordinator_name: departmentCoordinatorName,
        email,
        requesting_user_id: userId,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const result = data[0];

      if (result && !result.is_new_user && !result.has_role && result.auth_id) {
        toast.success(
          'User already exists, assigned department coordinator role.'
        );
      } else if (result && !result.is_verified && sendInvite) {
        try {
          const data = await sendInviteEmail(email, result.user_id);

          if (data) {
            await supabase
              .from('users')
              .update({ is_registered: true, auth_id: data.user.id })
              .eq('id', result.user_id);
          }

          toast.success('Department added successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to send invite.');
        }
      } else {
        toast.success('Department added successfully.');
      }
    } catch (error) {
      toast.error('Failed to add department. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    addDepartment,
    isLoading,
  };
};

export const useDeleteDepartment = ({
  instituteId,
  requestingUserId,
}: {
  instituteId: string;
  requestingUserId: string;
}) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const deleteDepartment = async (userId: string, authId: string | null) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: currentData.data.filter((dept) => dept.uid !== userId),
      };
    }, false);

    try {
      const { data, error } = await supabase.rpc('delete_department', {
        user_id: userId,
        institute_id: instituteId,
        requesting_user_id: requestingUserId,
      });

      if (error) {
        toast.error(error.details);
        return;
      }

      const result = data as {
        is_user_deleted: boolean;
      } | null;

      if (authId && result && !result.is_user_deleted) {
        toast.success('Department role deleted successfully.');
      }

      if (authId && result && result.is_user_deleted) {
        try {
          await deleteUserById(authId);
          toast.success('Department deleted successfully.');
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else toast.error('Failed to delete department.');
        }
      }
      if (!authId && result) toast.success('Department deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete department. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    deleteDepartment,
    isLoading,
  };
};

export const useSendDepartmentInvite = ({
  instituteId,
}: {
  instituteId: string;
}) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (email: string, userId: string, name: string) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;

      return {
        ...currentData,
        data: currentData.data.map((dept) =>
          dept.uid === userId
            ? {
                ...dept,
                users: dept.users
                  ? { ...dept.users, is_registered: true }
                  : dept.users,
              }
            : dept
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
