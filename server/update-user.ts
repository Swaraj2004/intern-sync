'use server';

import { getRoles } from '@/app/helpers';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServer } from '@/utils/supabase/server';

type Roles = { id: string; name: string }[];

export default async function updateUserByAuthId(
  authId: string,
  roleName?: string,
  newName?: string,
  roleAction: 'add' | 'remove' = 'add'
) {
  const supabase = supabaseServer();
  const supabaseAdminClient = supabaseAdmin();

  // Get the currently authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authorized.');
  }

  // Fetch all roles from the database
  const { data, error: rolesError } = await getRoles();
  if (rolesError) {
    throw new Error(rolesError.details);
  }

  const roles: Roles = data;

  // Create a role map from the role name to the role id
  const roleMap = roles.reduce((acc, { name, id }) => {
    acc[name] = id;
    return acc;
  }, {} as Record<string, string>);

  // Get the role IDs from the current user's metadata
  const roleIds = user.user_metadata.role_ids as string[];

  // Ensure the current user has the required role to update other users
  const hasRole =
    roleIds.includes(roleMap['institute-coordinator']) ||
    roleIds.includes(roleMap['department-coordinator']) ||
    roleIds.includes(roleMap['college-mentor']);

  if (!hasRole) {
    throw new Error('User does not have the required role.');
  }

  // Fetch the user by authId
  const { data: existingUser, error: getUserError } =
    await supabaseAdminClient.auth.admin.getUserById(authId);
  if (getUserError) {
    throw new Error(getUserError.message);
  }

  const oldName = existingUser.user.user_metadata.name;
  const oldRoleIds =
    (existingUser.user.user_metadata.role_ids as string[]) || [];

  let updatedRoleIds = oldRoleIds;

  // If roleName is provided, find the corresponding roleId
  if (roleName) {
    const roleId = roleMap[roleName];

    if (!roleId) {
      throw new Error(`Role "${roleName}" not found.`);
    }

    if (roleAction === 'add' && !oldRoleIds.includes(roleId)) {
      updatedRoleIds = [...oldRoleIds, roleId];
    } else if (roleAction === 'remove') {
      updatedRoleIds = oldRoleIds.filter((id) => id !== roleId);
    }
  }

  // Update the user metadata with new name and roles
  const { data: updatedUser, error: updateUserError } =
    await supabaseAdminClient.auth.admin.updateUserById(authId, {
      user_metadata: {
        name: newName || oldName,
        role_ids: updatedRoleIds,
      },
    });

  if (updateUserError) {
    throw new Error(updateUserError.message);
  }

  return updatedUser;
}
