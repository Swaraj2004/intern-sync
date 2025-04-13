import { Button } from '@/components/ui/button';
import MentorEvaluation from '@/types/mentor-evaluations';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';
import AddResponsesForm from '@/app/dashboard/(roles)/student/evaluations/AddResponsesForm';

type ColumnProps = {
  studentId: string;
};

const getMentorEvaluationColumns = ({
  studentId,
}: ColumnProps): ColumnDef<MentorEvaluation>[] => [
  {
    id: 'evaluation_name',
    accessorFn: (row) => row?.evaluation_name,
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
    cell: ({ row }) => <div>{row.original?.evaluation_name || '-'}</div>,
  },
  {
    id: 'evaluation_date',
    accessorFn: (row) => row?.evaluation_date,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Date
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.original.evaluation_date || '-'}</div>
    ),
  },
  {
    id: 'evaluator_name',
    accessorFn: (row) => row?.evaluator_name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Evaluator Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.evaluator_name || '-'}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-3">
          {row.original?.eval_toggle && (
            <AddResponsesForm
              mentorEvalId={row.original.mentor_evaluation_id}
              studentId={studentId}
            />
          )}
        </div>
      );
    },
  },
];

export default getMentorEvaluationColumns;
