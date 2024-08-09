import { supabaseServer } from '@/utils/supabase/server';

function getAuth() {
  const { auth } = supabaseServer();
  return auth;
}

export const getUser = async () => {
  const auth = getAuth();
  const user = (await auth.getUser()).data.user;
  if (!user) return null;

  return user;
};
