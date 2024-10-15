import { Badge } from '@/components/ui/badge';

const ReportStatus = ({
  status,
  noInternship,
  isHolidayForStudent,
}: {
  status: string | null;
  noInternship: boolean;
  isHolidayForStudent: boolean;
}) => {
  return (
    <>
      {noInternship && (
        <Badge className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-300 dark:hover:bg-gray-400 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          No Internship
        </Badge>
      )}
      {status === 'approved' && (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          Approved
        </Badge>
      )}
      {status === 'revision' && (
        <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          Revision
        </Badge>
      )}
      {status === 'pending' && (
        <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          Pending Approval
        </Badge>
      )}
      {!status && !noInternship && isHolidayForStudent && (
        <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          Holiday
        </Badge>
      )}
      {!status && !noInternship && !isHolidayForStudent && (
        <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
          Not Submitted
        </Badge>
      )}
    </>
  );
};

export default ReportStatus;
