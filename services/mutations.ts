import deleteUserById from '@/server/delete-user';
import sendInviteEmail from '@/server/send-invite';
import updateUserByAuthId from '@/server/update-user';
import { supabaseClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDepartments } from './queries';

const supabase = supabaseClient();

export const useAddDepartment = ({ instituteId }: { instituteId: number }) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addDepartment = async (
    departmentName: string,
    departmentCoordinatorName: string,
    email: string,
    sendInvite: boolean,
    roleId: string
  ) => {
    setIsLoading(true);

    const { data, error } = await supabase.rpc('add_department_coordinator', {
      institute_id: instituteId,
      department_name: departmentName,
      department_coordinator_name: departmentCoordinatorName,
      email,
      role_id: roleId,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const result = data[0];

    if (result && result.is_new_user === false && result.has_role === false) {
      try {
        await updateUserByAuthId(result.auth_id, roleId);
        mutate();
        toast.success(
          'User already exists, assigned department coordinator role.'
        );
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else console.error(error);
      }
      setIsLoading(false);
      return;
    }

    if (result && result.is_new_user === true && sendInvite) {
      try {
        const data = await sendInviteEmail(
          email,
          result.user_id,
          departmentCoordinatorName,
          instituteId,
          roleId
        );

        if (data) {
          await supabase
            .from('users')
            .update({ is_registered: true, auth_id: data.user.id })
            .eq('id', result.user_id);
        }
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to send invite.');
      }
    }

    mutate();
    toast.success('Department added successfully.');
    setIsLoading(false);
  };

  return {
    addDepartment,
    isLoading,
  };
};

export const useDeleteDepartment = ({
  instituteId,
}: {
  instituteId: number;
}) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const deleteDepartment = async (
    roleId: string,
    userId: string,
    authId: string | null
  ) => {
    setIsLoading(true);

    const { data, error } = await supabase.rpc('delete_department', {
      role_id: roleId,
      user_id: userId,
    });

    const result = data as {
      is_user_deleted: boolean;
    } | null;

    if (authId && result && result.is_user_deleted === false) {
      try {
        await updateUserByAuthId(authId, undefined, roleId, 'remove');
        toast.success('Department role deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to delete department.');
      }
    }

    if (authId && result && result.is_user_deleted === true) {
      try {
        await deleteUserById(authId);
        toast.success('Department deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to delete department.');
      }
    }

    if (error) {
      toast.error(error.message);
      console.error(error);
    } else {
      mutate();
    }

    setIsLoading(false);
  };

  return {
    deleteDepartment,
    isLoading,
  };
};

export const useSendInvite = ({ instituteId }: { instituteId: number }) => {
  const { mutate } = useDepartments({
    instituteId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (
    email: string,
    userId: string,
    name: string,
    insitituteId: number,
    roleId: string
  ) => {
    setIsLoading(true);

    try {
      const { user } = await sendInviteEmail(
        email,
        userId,
        name,
        insitituteId,
        roleId
      );
      await supabase
        .from('users')
        .update({ is_registered: true, auth_id: user.id })
        .eq('id', userId);
      mutate();
      setIsLoading(false);
      toast.success('Invite sent successfully.');
    } catch (error) {
      if (typeof error === 'string') toast.error(error);
      else toast.error('Failed to send invite.');
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    isLoading,
  };
};
