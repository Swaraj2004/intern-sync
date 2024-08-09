'use client';

import { Button } from '@/components/ui/button';
import { supabaseClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const GetStartedButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = supabaseClient();
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    fetchSession();
  }, []);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex md:hidden justify-center pt-8">
      {mounted && (
        <Button variant="outline" asChild>
          <Link href={user ? '/dashboard' : '/register/institute'}>
            Get Started
          </Link>
        </Button>
      )}
    </div>
  );
};

export default GetStartedButton;
