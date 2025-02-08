'use client';

import InternshipDetailsCard from '@/components/internships/InternshipDetailsCard';
import UpdateInternshipDialog from '@/components/internships/UpdateInternshipDialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { useUser } from '@/context/UserContext';
import { useUpdateInternship } from '@/services/mutations/internships';
import { useInternshipDetails } from '@/services/queries';
import { useParams } from 'next/navigation';

const InternshipDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { user } = useUser();

  const { data: internshipDetails, isLoading } = useInternshipDetails({
    internshipId: params.id,
  });

  const { updateInternship } = useUpdateInternship({
    internshipId: params.id,
    collegeMentorId: user?.uid,
  });

  return (
    <div>
      <div className="flex justify-between pb-5 gap-4">
        <span className="flex items-center gap-4 flex-wrap">
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
        </span>
        {internshipDetails && (
          <UpdateInternshipDialog
            internshipId={params.id}
            internshipDetails={internshipDetails[0]}
            updateInternship={updateInternship}
          />
        )}
      </div>
      {isLoading ? (
        <Card className="flex justify-center align items-center h-80">
          <Loader />
        </Card>
      ) : (
        internshipDetails &&
        internshipDetails[0] && (
          <InternshipDetailsCard
            internshipDetails={internshipDetails[0]}
            internshipId={params.id}
          />
        )
      )}
    </div>
  );
};

export default InternshipDetailsPage;
