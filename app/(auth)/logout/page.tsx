'use client';

import { supabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = supabaseClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (!signOutError) {
        router.push('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };

    logout();
  }, [router]);
};

export default LogoutPage;
