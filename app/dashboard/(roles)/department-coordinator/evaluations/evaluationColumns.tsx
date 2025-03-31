import { EvaluationActions } from '@/app/dashboard/(roles)/department-coordinator/evaluations/EvaluationActions';
import { Button } from '@/components/ui/button';
import Evaluations from '@/types/evaluations';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onDelete: (evaluationId: string) => void;
  onUpdate: (evaluationId: string, name: string, date: string) => void;
  dashboardRole: string;
};

const getStudentColumns = ({
  onDelete,
  onUpdate,
  dashboardRole,
}: ColumnProps): ColumnDef<Evaluations>[] => [
  {
    id: 'name',
    accessorFn: (row) => row?.name,
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
    cell: ({ row }) => <div>{row.original?.name || '-'}</div>,
  },
  {
    id: 'date',
    accessorFn: (row) => row?.date,
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
      <div className="lowercase">{row.original.date || '-'}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const evalId = row.original.id;

      return (
        <EvaluationActions
          deleteEvaluation={async () => onDelete(evalId)}
          updateEvaluation={onUpdate}
          evaluation={row.original}
          dashboardRole={dashboardRole}
        />
      );
    },
  },
];

export default getStudentColumns;
