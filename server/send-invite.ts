'use server';

import { getRoles } from '@/app/helpers';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServer } from '@/utils/supabase/server';

type Roles = { id: string; name: string }[];

export default async function sendInviteEmail(email: string, uid: string) {
  const supabase = supabaseServer();
  const supabaseAdminClient = supabaseAdmin();

  // Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authorized.');
  }

  // Fetch all roles from the database
  const { data: rolesData, error: rolesError } = await getRoles();
  if (rolesError) {
    throw new Error(rolesError.details);
  }

  const roles: Roles = rolesData;
  const roleMap = roles.reduce((acc, { name, id }) => {
    acc[name] = id;
    return acc;
  }, {} as Record<string, string>);

  // Fetch the user's roles from user_roles table
  const { data: userRoles, error: userRolesError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('uid', user.user_metadata.uid);

  if (userRolesError) {
    throw new Error(userRolesError.message);
  }

  // Get role IDs from user_roles
  const userRoleIds = userRoles.map((role) => role.role_id);

  // Check if the user has the appropriate role to send an invite
  const hasRequiredRole =
    userRoleIds.includes(roleMap['institute-coordinator']) ||
    userRoleIds.includes(roleMap['department-coordinator']) ||
    userRoleIds.includes(roleMap['college-mentor']);

  if (!hasRequiredRole) {
    throw new Error('User does not have the required role.');
  }

  // Send the invite email using Supabase admin client
  const { data, error: inviteError } =
    await supabaseAdminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        uid,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/verify-email`,
    });

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  return data;
}
