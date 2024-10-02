import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const AddInternshipCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-900 dark:text-blue-200">
          Unlock Internship Features!
        </CardTitle>
        <CardDescription>
          You will be able to submit daily reports and attendace once you have
          an active internship. Get started by adding an internship.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link href="/dashboard/student/internships">Add Internship</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddInternshipCard;
