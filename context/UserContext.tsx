'use client';

import User from '@/types/user';
import { supabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type UserContextType = {
  user: User | null;
  roles: { [key: string]: string };
  instituteId: string | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const [instituteId, setInstituteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseClient();

    const fetchUserDetails = async (uid: string) => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, auth_id, user_roles (role_id, roles(name))')
        .eq('id', uid)
        .single();

      if (userError) {
        console.error('Error fetching user details:', userError);
        setUser(null);
        return;
      }

      setUser({
        uid: userData.id,
        name: userData.name,
        email: userData.email,
        auth_id: userData.auth_id,
      });

      const userRoles: { [key: string]: string } = {};
      userData.user_roles.forEach((role) => {
        userRoles[role.roles?.name as string] = role.role_id as string;
      });

      setRoles(userRoles);

      if (userRoles['institute-coordinator']) {
        setInstituteId(userData.id);
      } else if (userRoles['department-coordinator']) {
        const { data: departmentData, error: departmentError } = await supabase
          .from('departments')
          .select('institute_id')
          .eq('uid', uid)
          .single();

        if (departmentError) {
          console.error(
            'Error fetching institute_id for department:',
            departmentError
          );
          return;
        }

        setInstituteId(departmentData.institute_id);
      } else if (userRoles['college-mentor']) {
        const { data: mentorData, error: mentorError } = await supabase
          .from('college_mentors')
          .select('institute_id')
          .eq('uid', uid)
          .single();

        if (mentorError) {
          console.error(
            'Error fetching institute_id for college mentor:',
            mentorError
          );
          return;
        }

        setInstituteId(mentorData.institute_id);
      } else if (userRoles['student']) {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('institute_id')
          .eq('uid', uid)
          .single();

        if (studentError) {
          console.error(
            'Error fetching institute_id for student:',
            studentError
          );
          return;
        }

        setInstituteId(studentData.institute_id);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const uid = session.user.user_metadata.uid;
          await fetchUserDetails(uid);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRoles({});
          router.push('/');
        } else {
          setUser(null);
          setRoles({});
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <UserContext.Provider value={{ user, roles, instituteId, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
