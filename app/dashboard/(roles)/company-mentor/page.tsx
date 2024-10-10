'use client';

import CompleteProfileCard from '@/app/dashboard/(roles)/company-mentor/CompleteProfileCard';
import StudentsTable from '@/app/dashboard/(roles)/company-mentor/StudentsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { useCompanyMentorProfile } from '@/services/queries';

const CompanyMentorDashboardPage = () => {
  const { user } = useUser();

  const { data: mentorData } = useCompanyMentorProfile({
    userId: user?.uid!,
  });

  const isProfileIncomplete =
    mentorData &&
    (!mentorData.users?.name ||
      !mentorData.users?.contact ||
      !mentorData.designation ||
      !mentorData.company_name ||
      !mentorData.company_address ||
      !mentorData.company_latitude ||
      !mentorData.company_longitude ||
      !mentorData.company_radius);

  return (
    <>
      <div className="pb-5">
        <h1 className="text-2xl font-semibold flex items-center">
          Hello,&nbsp;
          {user ? user.name : <Skeleton className="h-8 w-40 inline-block" />}
          &nbsp;👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 py-2">
          Welcome to your company mentor dashboard.
        </p>
      </div>
      {isProfileIncomplete && <CompleteProfileCard />}
      <StudentsTable />
    </>
  );
};

export default CompanyMentorDashboardPage;
