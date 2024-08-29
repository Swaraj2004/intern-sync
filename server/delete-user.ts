'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';

export default async function deleteUserById(authId: string) {
  const supabaseAdminClient = supabaseAdmin();

  try {
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
