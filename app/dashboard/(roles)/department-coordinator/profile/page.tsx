'use client';

import ProfileCard from '@/app/dashboard/(roles)/department-coordinator/profile/ProfileCard';
import UpdateProfile from '@/app/dashboard/(roles)/department-coordinator/profile/UpdateProfile';
import ChangePassword from '@/components/ui/ChangePassword';
import { Loader } from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { useUpdateDepartmentProfile } from '@/services/mutations/profile';
import { useDepartmentProfile } from '@/services/queries';
import { useState } from 'react';

const ProfilePage = () => {
  const { user } = useUser();
  const [showProfileCard, setShowProfileCard] = useState(true);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile } =
    useDepartmentProfile({
      userId: user?.uid!,
    });

  const { updateDepartmentProfile } = useUpdateDepartmentProfile({
    userId: user?.uid!,
  });

  return (
    <>
      <div className="flex justify-between items-center pb-5 h-14">
        <h1 className="font-semibold text-2xl">Profile</h1>
        {showProfileCard && (
          <Button
            size="sm"
            onClick={() => {
              setShowUpdateProfile(!showUpdateProfile);
              setShowProfileCard(!showProfileCard);
            }}
          >
            Update Profile
          </Button>
        )}
      </div>
      {isLoadingProfile && (
        <Card className="flex justify-center align items-center h-80">
          <Loader />
        </Card>
      )}
      {profileData && showProfileCard && (
        <ProfileCard profileData={profileData} />
      )}
      {profileData && showUpdateProfile && (
        <UpdateProfile
          setShowProfileCard={setShowProfileCard}
          setShowUpdateProfile={setShowUpdateProfile}
          updateDepartmentProfile={updateDepartmentProfile}
          profileData={profileData}
        />
      )}
      <ChangePassword />
    </>
  );
};

export default ProfilePage;
