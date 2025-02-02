'use client';

import ProfileCard from '@/components/studentProfile/ProfileCard';
import { Loader } from '@/components/ui/Loader';
import { Card } from '@/components/ui/card';
import { useStudentProfile } from '@/services/queries';
import { useParams } from 'next/navigation';

const StudentDetailsPage = () => {
  const params = useParams<{ id: string }>();

  const { data: profileData, isLoading: isLoadingProfile } = useStudentProfile({
    userId: params.id,
  });

  return (
    <>
      <div className="flex justify-between items-center pb-5 h-14">
        <h1 className="font-semibold text-2xl">Student Details</h1>
      </div>
      {isLoadingProfile && (
        <Card className="flex justify-center align items-center h-80">
          <Loader />
        </Card>
      )}
      {profileData && <ProfileCard profileData={profileData} />}
    </>
  );
};

export default StudentDetailsPage;
