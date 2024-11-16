'use client';

import { Button } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const GuestLogin = () => {
  const supabase = supabaseClient();
  const pathname = usePathname();
  const router = useRouter();
  const role = pathname.split('/')[2];
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('guest_creds')
      .select('role, email, password')
      .eq('role', role)
      .single();

    if (error || !data) {
      toast.error('Something went wrong.');
      setLoading(false);
      return;
    }

    const { error: signinError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signinError) {
      toast.error(signinError.message);
      setLoading(false);
      return;
    }

    toast.success('Login successfull. Redirecting to dashboard...');

    router.push(`/dashboard/${role}`);
  };

  return (
    <Button
      variant="link"
      onClick={handleGuestLogin}
      className="p-0 h-fit hover:no-underline font-normal"
    >
      {loading ? 'Logging in...' : 'Login as Guest'}
    </Button>
  );
};

export default GuestLogin;
