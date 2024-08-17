import { supabaseClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getAuth() {
  const { auth } = supabaseClient();
  return auth;
}

export function useGetUser() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth();

    const { data: authListener } = auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user;
        const shouldUpdate = sessionUser?.updated_at !== user?.updated_at;
        if (shouldUpdate) {
          if (sessionUser) {
            const fetchedUser: User = await fetch('/api/get-user').then((res) =>
              res.json()
            );
            setUser(fetchedUser);
          } else {
            setUser(null);
            if (pathname !== '/') {
              router.push('/');
            }
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user, router, pathname]);

  return user;
}
