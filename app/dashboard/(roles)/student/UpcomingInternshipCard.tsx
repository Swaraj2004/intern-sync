import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDateForDisplay } from '@/lib/utils';
import StudentInternship from '@/types/student-internship';
import Link from 'next/link';

const UpcomingInternshipCard = ({
  internship,
}: {
  internship: StudentInternship;
}) => {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="text-green-600 dark:text-green-400">
          Congratulations on Your Internship!
        </CardTitle>
        <CardDescription>
          You have an upcoming internship as a{' '}
          <strong>{internship.role}</strong> at{' '}
          <strong>{internship.company_name}</strong>. Once the internship is
          approved you will be able to mark attendance and submit reports from
          the start date of internship.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Start Date:</strong>{' '}
          {formatDateForDisplay(internship.start_date)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>End Date:</strong> {formatDateForDisplay(internship.end_date)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Status:</strong>{' '}
          {internship.approved ? (
            <span className="text-green-500 dark:text-green-400">Approved</span>
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
  );
};

export default UpcomingInternshipCard;
