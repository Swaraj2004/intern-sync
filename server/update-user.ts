'use server';

import { getRoles } from '@/app/helpers';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServer } from '@/utils/supabase/server';

type Roles = { id: string; name: string }[];

export default async function updateUserByAuthId(
  authId: string,
  newName?: string,
  newRoleId?: string
) {
  const supabase = supabaseServer();
  const supabaseAdminClient = supabaseAdmin();

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
    throw new Error(getUserError.message);
  }

  const oldName = existingUser.user.user_metadata.name;
  const oldRoleIds = existingUser.user.user_metadata.role_ids as string[];

  const { data: updatedUser, error: updateUserError } =
    await supabaseAdminClient.auth.admin.updateUserById(authId, {
      user_metadata: {
        name: newName || oldName,
        role_ids: newRoleId ? [...oldRoleIds, newRoleId] : oldRoleIds,
      },
    });

  if (updateUserError) {
    throw new Error(updateUserError.message);
  }

  return updatedUser;
}
