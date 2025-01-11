'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  UserPlusIcon,
  UserRoundCheckIcon,
  UsersIcon,
} from 'lucide-react';
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

  const { count: registeredStudents } = useQuery(
    user
      ? supabase
          .from('students')
          .select('uid, users!inner(is_registered)', { count: 'exact' })
          .eq('institute_id', user?.uid!)
          .eq('users.is_registered', true)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const { count: studentsWithInternships } = useQuery(
    user
      ? supabase
          .from('internships')
          .select('id', { count: 'exact' })
          .eq('institute_id', user?.uid!)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const { count: studentsWithMentors } = useQuery(
    user
      ? supabase
          .from('students')
          .select('uid', { count: 'exact' })
          .eq('institute_id', user?.uid!)
          .not('college_mentor_id', 'is', null)
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
      icon: Building2Icon,
      denominator: '-',
    },
    {
      name: 'Total College Mentors',
      total: mentorCount,
      icon: UsersIcon,
      denominator: '-',
    },
    {
      name: 'Total Students',
      total: studentCount,
      icon: UsersIcon,
      denominator: '-',
    },
    {
      name: 'Registered Students',
      total: registeredStudents,
      icon: UserRoundCheckIcon,
      denominator: studentCount,
    },
    {
      name: 'Students with Internships',
      total: studentsWithInternships,
      icon: BriefcaseBusinessIcon,
      denominator: studentCount,
    },
    {
      name: 'Students with Assigned Mentors',
      total: studentsWithMentors,
      icon: UserPlusIcon,
      denominator: studentCount,
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
      <div className="grid gap-8 min-[550px]:grid-cols-2 md:grid-cols-3">
        {data.map((item, index) => (
          <Card key={index} className="text-center grid">
            <CardHeader className="flex flex-col items-center space-y-3">
              <item.icon className="h-8 w-8 text-primary" />
              <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {typeof item.total !== 'number' ? (
                  <Skeleton className="h-10 w-16 mx-auto" />
                ) : (
                  <CountUp
                    end={item.total}
                    duration={2.5}
                    separator=","
                    suffix={
                      typeof item.denominator === 'number'
                        ? ` / ${item.denominator}`
                        : ''
                    }
                  />
                )}
              </div>
              {item.denominator !== '-' && (
                <div className="text-sm text-muted-foreground font-medium mt-2">
                  {typeof item.total !== 'number' ||
                  typeof item.denominator !== 'number' ? (
                    <Skeleton className="h-4 w-24 mx-auto" />
                  ) : (
                    `${
                      item.denominator === 0 || item.total === 0
                        ? 0
                        : ((item.total / item.denominator) * 100).toFixed(1)
                    }%`
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default InstituteCoordinatorDashboardPage;
