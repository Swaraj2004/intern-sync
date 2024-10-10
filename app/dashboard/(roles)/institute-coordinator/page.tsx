'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { Building2, GraduationCap, Users } from 'lucide-react';
import CountUp from 'react-countup';

const supabase = supabaseClient();

const InstituteCoordinatorDashboardPage = () => {
  const { user } = useUser();

  const { count: departmentCount } = useQuery(
    user
      ? supabase
          .from('departments')
          .select('uid', { count: 'exact' })
          .eq('institute_id', user?.uid!)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
  const { count: mentorCount } = useQuery(
    user
      ? supabase
          .from('college_mentors')
          .select('uid', { count: 'exact' })
          .eq('institute_id', user?.uid!)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
  const { count: studentCount } = useQuery(
    user
      ? supabase
          .from('students')
          .select('uid', { count: 'exact' })
          .eq('institute_id', user?.uid!)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const data = [
    {
      name: 'Active Departments',
      total: departmentCount,
      icon: Building2,
    },
    {
      name: 'Registered College Mentors',
      total: mentorCount,
      icon: GraduationCap,
    },
    {
      name: 'Total Students',
      total: studentCount,
      icon: Users,
    },
  ];

  return (
    <>
      <div className="pb-5">
        <h1 className="text-2xl font-semibold flex items-center">
          Hello,&nbsp;
          {user ? user.name : <Skeleton className="h-8 w-40 inline-block" />}
          &nbsp;👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 py-2">
          Welcome to your institute dashboard.
        </p>
      </div>
      <div className="grid gap-8 min-[700px]:grid-cols-3">
        {data.map((item, index) => (
          <Card key={index} className="text-center grid">
            <CardHeader className="flex flex-col items-center space-y-3">
              <item.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {typeof item.total === 'number' ? (
                  <CountUp end={item.total} duration={2.5} />
                ) : (
                  <Skeleton className="h-10 w-16 mx-auto" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default InstituteCoordinatorDashboardPage;
