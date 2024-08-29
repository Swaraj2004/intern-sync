import sendInviteEmail from '@/server/send-invite';
import updateUserByAuthId from '@/server/update-user';
import { supabaseClient } from '@/utils/supabase/client';
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-swr';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDepartments } from './queries';
import deleteUserById from '@/server/delete-user';

const supabase = supabaseClient();

export const useAddDepartment = ({
  instituteId,
  departmentName,
  departmentCoordinatorName,
  sendInvite,
  email,
  roleId,
}: {
  instituteId: number;
  departmentName: string;
  departmentCoordinatorName: string;
  sendInvite: boolean;
  email: string;
  roleId: string;
}) => {
  const { mutate } = useDepartments({
    instituteId,
  });

  return useInsertMutation(supabase.from('users'), ['id'], 'id', {
    onError: async (error) => {
      if (error.code === '23505') {
        if (!email) return;
        const { data: existingUser, error: fetchUserError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (fetchUserError) {
          toast.error(fetchUserError.details);
          return;
        }

        const userId = existingUser.id;

        const { data: existingRole, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('uid', userId)
          .eq('role_id', roleId);

        if (roleError) {
          toast.error(roleError.details);
          return;
        }

        if (existingRole.length === 0) {
          if (instituteId && existingUser.auth_id) {
            try {
              const data = await updateUserByAuthId(
                existingUser.auth_id,
                existingUser.name,
                roleId
              );

              if (data) {
                await supabase.from('departments').insert({
                  name: departmentName,
                  uid: userId,
                  institute_id: instituteId,
                });

                await supabase.from('user_roles').insert({
                  uid: userId,
                  role_id: roleId,
                });
              }
            } catch (error) {
              if (typeof error === 'string') toast.error(error);
              else console.error(error);
            }
          }
        } else {
          toast.error('User is already a department coordinator.');
          return;
        }

        mutate();

        toast.success(
          'User already exists, assigned department coordinator role.'
        );
      } else {
        toast.error(error.message);
      }
    },
    onSuccess: async (data) => {
      const userId = data![0].id;

      if (instituteId) {
        await supabase.from('departments').insert({
          name: departmentName,
          uid: userId,
          institute_id: instituteId,
        });

        await supabase
          .from('user_roles')
          .insert({ uid: userId, role_id: roleId });
      }

      if (sendInvite) {
        try {
          const data = await sendInviteEmail(
            email,
            userId,
            departmentCoordinatorName,
            instituteId,
            roleId
          );

          if (data) {
            await supabase
              .from('users')
              .update({ is_registered: true, auth_id: data.user.id })
              .eq('id', userId);
          }
        } catch (error) {
          if (typeof error === 'string') toast.error(error);
          else console.error(error);
        }
      }

      mutate();

      toast.success('Department added successfully.');
    },
  });
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
  const [error, setError] = useState<string | null>(null);

  const deleteDepartment = async (
    roleId: string,
    userId: string,
    authId: string | null
  ) => {
    setIsLoading(true);
    setError(null);

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
        toast.success('Role deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else console.error(error);
      }
    }

    if (authId && result && result.is_user_deleted === true) {
      try {
        await deleteUserById(authId);
        toast.success('Department deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else console.error(error);
      }
    }

    if (error) {
      setError(error.message);
      toast.error(`Failed to delete department role: ${error.message}`);
      console.error(error);
    } else {
      mutate();
      toast.success('Department deleted successfully.');
      console.log(data);
    }

    setIsLoading(false);
  };

  return {
    deleteDepartment,
    isLoading,
    error,
  };
};
