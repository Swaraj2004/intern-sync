import { Card } from '@/components/ui/card';
import StudentProfile from '@/types/student-profile';
import { formatDateForDisplay } from '@/lib/utils';

const ProfileCard = ({ profileData }: { profileData: StudentProfile }) => {
  const fields = [
    { label: 'Full Name', value: profileData.users?.name || '-' },
    { label: 'Email', value: profileData.users?.email || '-' },
    {
      label: 'Date of Birth',
      value: profileData.dob ? formatDateForDisplay(profileData.dob) : '-',
    },
    { label: 'Contact', value: profileData.users?.contact || '-' },
    { label: 'Admission Year', value: profileData.admission_year || '-' },
    { label: 'Division', value: profileData.division || '-' },
    { label: 'Roll No', value: profileData.roll_no || '-' },
    { label: 'Admission ID', value: profileData.admission_id || '-' },
    { label: 'Address', value: profileData.address || '-' },
    {
      label: 'Home Coordinates',
      value:
        profileData.home_latitude && profileData.home_longitude
          ? `${profileData.home_latitude}, ${profileData.home_longitude}`
          : '-',
    },
    {
      label: 'College Mentor',
      value: profileData.college_mentors?.users?.name || '-',
    },
    { label: 'Department', value: profileData.departments?.name || '-' },
    { label: 'Institute', value: profileData.institutes?.name || '-' },
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
