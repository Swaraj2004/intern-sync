import { supabaseServer } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const LogoutPage = async () => {
  const supabase = supabaseServer();

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    return;
  }

  redirect('/');
};

export default LogoutPage;
