'use server';

import { getRoles } from '@/app/helpers';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServer } from '@/utils/supabase/server';

type Roles = { id: string; name: string }[];

export default async function sendInviteEmail(
  email: string,
  uid: string,
  name: string,
  insitituteId: number,
  roleId: string
) {
  const supabase = supabaseServer();
  const supabaseAdminClient = supabaseAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authorized.');
  }

  const { data: rolesData, error: rolesError } = await getRoles();
  if (rolesError) {
    throw new Error(rolesError.details);
  }

  const roles: Roles = rolesData;
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

  const { data, error: inviteError } =
    await supabaseAdminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        uid,
        name,
        email,
        institute_id: insitituteId,
        role_ids: [roleId],
      },
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/verify-email`,
    });

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  return data;
}
