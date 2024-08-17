'use client';

import { supabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      const supabase = supabaseClient();
      await supabase.auth.signOut();
    };

    logout();
    router.push('/');
  }, [router]);
};

export default LogoutPage;
