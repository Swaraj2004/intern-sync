'use client';

import { Badge } from '@/components/ui/badge';

const AttendanceStatus = ({ status }: { status: string | null }) => {
  return (
    <div className="flex items-center">
      {status === 'present' && (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
          Present
        </Badge>
      )}
      {status === 'pending' && (
        <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300">
          Pending
        </Badge>
      )}
      {status === 'absent' && (
        <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-300 dark:hover:bg-red-400">
          Absent
        </Badge>
      )}
      {!status && (
        <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap">
          Not submitted
        </Badge>
      )}
    </div>
  );
};

export default AttendanceStatus;
