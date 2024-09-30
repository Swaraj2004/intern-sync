'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/context/UserContext';
import { formatDateForDisplay } from '@/lib/utils';
import { useStudentInternships, useStudentProfile } from '@/services/queries';
import { CircleAlertIcon } from 'lucide-react';
import Link from 'next/link';

const StudentDashboardPage = () => {
  const { user } = useUser();

  const { data: studentData } = useStudentProfile({
    userId: user?.user_metadata.uid,
  });

  const { data: studentInternships } = useStudentInternships({
    studentId: user?.user_metadata.uid,
  });

  const isProfileIncomplete =
    studentData &&
    (!studentData.dob ||
      !studentData.address ||
      !studentData.admission_year ||
      !studentData.division ||
      !studentData.roll_no ||
      !studentData.admission_id);

  const upcomingInternship = studentInternships?.find(
    (internship) => new Date(internship.start_date) > new Date()
  );

  if (!studentData) {
    return (
      <div className="h-60 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="pb-5">
        <h1 className="text-2xl font-semibold">
          Hello, {studentData?.users?.name} 👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 py-2">
          Welcome to your dashboard. Here you can view your internships, profile
          and more.
        </p>
      </div>
      {isProfileIncomplete && (
        <Card className="p-5 mb-4 flex gap-x-12 gap-y-4 justify-between flex-wrap sm:flex-nowrap border-yellow-400 dark:border-yellow-200 border-opacity-40 dark:border-opacity-30 bg-gray-50 dark:bg-[#191b2c]">
          <div>
            <div className="font-bold text-lg text-yellow-600 dark:text-yellow-200 flex gap-2 items-center">
              <CircleAlertIcon className="w-5 h-5" />
              <h2>Complete Your Profile</h2>
            </div>
            <p className="text-sm text-muted-foreground pt-1 sm:w-3/4 lg:w-full">
              It looks like some of your profile information is missing. Please
              complete your profile for a better experience on the platform.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              className="border-yellow-500 dark:border-yellow-200 border-opacity-30 dark:border-opacity-20"
              asChild
            >
              <Link href="/dashboard/student/profile">Complete Profile</Link>
            </Button>
          </div>
        </Card>
      )}
      {studentInternships && studentInternships.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200">
              Unlock Internship Features!
            </CardTitle>
            <CardDescription>
              You will be able to submit daily reports and attendace once you
              have an active internship. Get started by adding an internship.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/student/internships">Add Internship</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      {upcomingInternship && (
        <Card className="my-4">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              Congratulations on Your Internship!
            </CardTitle>
            <CardDescription>
              You have an upcoming internship as a{' '}
              <strong>{upcomingInternship.role}</strong> at{' '}
              <strong>{upcomingInternship.company_name}</strong>. Once the
              internship is approved you will be able to mark attendance and
              submit reports from the start date of internship.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Start Date:</strong>{' '}
              {formatDateForDisplay(upcomingInternship.start_date)}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>End Date:</strong>{' '}
              {formatDateForDisplay(upcomingInternship.end_date)}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Status:</strong>{' '}
              {upcomingInternship.approved ? (
                <span className="text-green-500 dark:text-green-400">
                  Approved
                </span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-300">
                  Pending Approval
                </span>
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/dashboard/student/internships`}>
                View Internship Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default StudentDashboardPage;
