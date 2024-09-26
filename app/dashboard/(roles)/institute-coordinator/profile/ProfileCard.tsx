import { Card } from '@/components/ui/card';
import InstituteProfile from '@/types/institute-profile';

const ProfileCard = ({ profileData }: { profileData: InstituteProfile }) => {
  return (
    <Card className="p-5">
      <div className="grid gap-6 overflow-x-auto">
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Full Name
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.users?.name || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">Email</div>
          <div className="col-span-3 flex items-center">
            {profileData.users?.email || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Contact
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.users?.contact || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Institute Name
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.name || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Institute Address
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.address || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Institute Email Domain
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.institute_email_domain || '-'}
          </div>
        </div>
        <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
          <div className="col-span-2 my-auto text-muted-foreground">
            Student Email Domain
          </div>
          <div className="col-span-3 flex items-center">
            {profileData.student_email_domain || '-'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
