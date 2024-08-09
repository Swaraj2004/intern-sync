import { supabaseClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useState } from 'react';

function getAuth() {
  const { auth } = supabaseClient();
  return auth;
}

export function useGetUser() {
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();

  auth.onAuthStateChange(async (event, session) => {
    const sessionUser = session?.user;
    const shouldUpdate = sessionUser?.updated_at !== user?.updated_at;
    if (shouldUpdate) {
      if (sessionUser) {
        const user: User = await fetch('/api/get-user').then((res) =>
          res.json()
        );
        setUser(user);
      } else {
        setUser(null);
      }
    }
  });

  return user;
}
