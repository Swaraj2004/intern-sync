import { MentorEvaluationActions } from '@/app/dashboard/(roles)/college-mentor/evaluations/MentorEvaluationActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MentorEvaluation from '@/types/mentor-evaluations';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onUpdate: (
    evaluationId: string,
    mentorEvaluationId: string,
    evalToggle: boolean,
    evaluatorId: string
  ) => void;
  dashboardRole: string;
};

const getMentorEvaluationColumns = ({
  onUpdate,
  dashboardRole,
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
        Name
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.evaluator_name || '-'}</div>,
  },
  {
    id: 'eval_toggle',
    accessorFn: (row) => row?.eval_toggle,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Status
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.original?.eval_toggle ? (
          <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
            Open
          </Badge>
        ) : (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-300 dark:hover:bg-blue-400 [text-shadow:_0_1px_0_rgb(0_0_0_/_15%)]">
            Closed
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <MentorEvaluationActions
          updateEvaluation={onUpdate}
          mentorEvaluation={row.original}
          dashboardRole={dashboardRole}
        />
      );
    },
  },
];

export default getMentorEvaluationColumns;
