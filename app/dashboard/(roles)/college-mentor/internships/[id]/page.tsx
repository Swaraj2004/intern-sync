'use client';

import InternshipDetailsCard from '@/app/dashboard/(roles)/college-mentor/internships/[id]/InternshipDetailsCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { useInternshipDetails } from '@/services/queries';
import { useParams } from 'next/navigation';

const InternshipDetailsPage = () => {
  const params = useParams<{ id: string }>();

  const { data: internshipDetails, isLoading } = useInternshipDetails({
    internshipId: params.id,
  });

  console.log(internshipDetails);

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Internship Details</h1>
        {internshipDetails &&
          (internshipDetails[0].approved ? (
            <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
              Approved
            </Badge>
          ) : (
            <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300">
              Pending Approval
            </Badge>
          ))}
      </div>
      {isLoading ? (
        <Card className="flex justify-center align items-center h-80">
          <Loader />
        </Card>
      ) : (
        internshipDetails &&
        internshipDetails[0] && (
          <InternshipDetailsCard internshipDetails={internshipDetails[0]} />
        )
      )}
    </div>
  );
};

export default InternshipDetailsPage;
