import { Button } from '@/components/ui/button';
import MentorEvaluationStudent from '@/types/mentor-evaluation-students';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';
import { EvaluationStudentsActions } from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/EvaluationStudentsActions';

const getStudentColumns = ({
  asEvaluator,
}: {
  asEvaluator: boolean;
}): ColumnDef<MentorEvaluationStudent>[] => [
  {
    id: 'name',
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.name || '-'}</div>,
  },
  {
    id: 'email',
    accessorFn: (row) => row.email,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Email
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.original.email || '-'}</div>
    ),
  },
  {
    id: 'roll_no',
    accessorFn: (row) => row.roll_no,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Roll No.
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.original.roll_no || '-'}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <EvaluationStudentsActions
          asEvaluator={asEvaluator}
          mentorEvaluationStudent={row.original}
        />
      );
    },
  },
];

export default getStudentColumns;
