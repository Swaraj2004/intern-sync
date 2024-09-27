import { Card } from '@/components/ui/card';
import CompanyMentorProfile from '@/types/company-mentor-profile';

const ProfileCard = ({
  profileData,
}: {
  profileData: CompanyMentorProfile;
}) => {
  const fields = [
    { label: 'Full Name', value: profileData.users?.name || '-' },
    { label: 'Email', value: profileData.users?.email || '-' },
    { label: 'Contact', value: profileData.users?.contact || '-' },
    { label: 'Designation', value: profileData.designation || '-' },
    { label: 'Company Name', value: profileData.company_name || '-' },
    { label: 'Company Address', value: profileData.company_address || '-' },
  ];

  return (
    <Card className="p-5">
      <div className="grid gap-6 overflow-x-auto">
        {fields.map((field, index) => (
          <div
            key={index}
            className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2"
          >
            <div className="col-span-2 my-auto text-muted-foreground">
              {field.label}
            </div>
            <div className="col-span-3 flex items-center">{field.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileCard;
