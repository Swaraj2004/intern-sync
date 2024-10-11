'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { supabaseClient } from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import {
  BriefcaseBusinessIcon,
  CalendarCheckIcon,
  FileCheckIcon,
  UsersIcon,
} from 'lucide-react';
import CountUp from 'react-countup';

const supabase = supabaseClient();

const CollegeMentorDashboardPage = () => {
  const { user } = useUser();

  const { count: studentCount } = useQuery(
    user
      ? supabase
          .from('students')
          .select('uid', { count: 'exact' })
          .eq('college_mentor_id', user?.uid!)
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
          .eq('college_mentor_id', user?.uid!)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const { data: internshipIds } = useQuery(
    user
      ? supabase
          .from('internships')
          .select('id')
          .eq('college_mentor_id', user.uid)
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const { count: reportsReviewCount } = useQuery(
    internshipIds && internshipIds?.length > 0
      ? supabase
          .from('internship_reports')
          .select('internship_id', { count: 'exact' })
          .in(
            'internship_id',
            internshipIds.map((internship) => internship.id)
          )
          .in('status', ['pending', 'revision'])
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const { count: pendingAttendanceCount } = useQuery(
    internshipIds && internshipIds?.length > 0
      ? supabase
          .from('attendance')
          .select('id', { count: 'exact' })
          .in(
            'internship_id',
            internshipIds.map((internship) => internship.id)
          )
          .eq('status', 'pending')
      : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  const data = [
    {
      name: 'Total Students',
      total: studentCount,
      icon: UsersIcon,
      denominator: '-',
    },
    {
      name: 'Students with Internships',
      total: studentsWithInternships,
      icon: BriefcaseBusinessIcon,
      denominator: studentCount,
    },
    {
      name: 'Reports to Review',
      total: reportsReviewCount,
      icon: FileCheckIcon,
      denominator: '-',
    },
    {
      name: 'Pending Attendance Approval',
      total: pendingAttendanceCount,
      icon: CalendarCheckIcon,
      denominator: '-',
    },
  ];

  return (
    <>
      <div className="pb-5">
        <h1 className="text-2xl font-semibold flex">
          <span>Hello,&nbsp;</span>
          <span>{user ? user.name : <Skeleton className="h-8 w-40" />}</span>
          <span>&nbsp;👋</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300 py-2">
          Welcome to your department dashboard.
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

export default CollegeMentorDashboardPage;
