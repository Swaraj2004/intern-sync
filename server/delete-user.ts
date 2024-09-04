'use server';

import { getRoles } from '@/app/helpers';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServer } from '@/utils/supabase/server';

type Roles = { id: string; name: string }[];

export default async function deleteUserById(authId: string) {
  const supabase = supabaseServer();
  const supabaseAdminClient = supabaseAdmin();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authorized.');
    }

    const { data, error: rolesError } = await getRoles();
    if (rolesError) {
      throw new Error(rolesError.details);
    }

    const roles: Roles = data;
    const roleMap = roles.reduce((acc, { name, id }) => {
      acc[name] = id;
      return acc;
    }, {} as Record<string, string>);
    const roleIds = user.user_metadata.role_ids as string[];

    const hasRole =
      roleIds.includes(roleMap['institute-coordinator']) ||
      roleIds.includes(roleMap['department-coordinator']) ||
      roleIds.includes(roleMap['college-mentor']);

    if (!hasRole) {
      throw new Error('User does not have the required role.');
    }

    const { data: existingUser, error: getUserError } =
      await supabaseAdminClient.auth.admin.getUserById(authId);

    if (getUserError) {
      throw new Error(`Error fetching user: ${getUserError.message}`);
    }

    if (!existingUser) {
      throw new Error('User does not exist.');
    }

    const { error: deleteError } =
      await supabaseAdminClient.auth.admin.deleteUser(authId);

    if (deleteError) {
      throw new Error(`Error deleting user: ${deleteError.message}`);
    }

    return { success: true, message: 'User deleted successfully.' };
  } catch (err) {
    console.error('Error in deleteUser function:', err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : 'An unknown error occurred.',
    };
  }
}
