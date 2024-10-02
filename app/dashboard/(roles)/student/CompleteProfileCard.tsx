import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CircleAlertIcon } from 'lucide-react';
import Link from 'next/link';

const CompleteProfileCard = () => {
  return (
    <Card className="p-5 mb-4 flex gap-x-12 gap-y-4 justify-between flex-wrap sm:flex-nowrap border-yellow-400 dark:border-yellow-200 border-opacity-40 dark:border-opacity-30 bg-gray-50 dark:bg-[#191b2c]">
      <div>
        <div className="font-bold text-lg text-yellow-600 dark:text-yellow-200 flex gap-2 items-center">
          <CircleAlertIcon className="w-5 h-5" />
          <h2>Complete Your Profile</h2>
        </div>
        <p className="text-sm text-muted-foreground pt-1 sm:w-3/4 lg:w-full">
          It looks like some of your profile information is missing. Please
          complete your profile for a better experience on the platform.
        </p>
      </div>
      <div>
        <Button
          variant="outline"
          className="border-yellow-500 dark:border-yellow-200 border-opacity-30 dark:border-opacity-20"
          asChild
        >
          <Link href="/dashboard/student/profile">Complete Profile</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CompleteProfileCard;
