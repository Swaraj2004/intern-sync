import { ParameterActions } from '@/app/dashboard/(roles)/department-coordinator/evaluations/[id]/ParameterActions';
import { Button } from '@/components/ui/button';
import Parameters from '@/types/parameters';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDownIcon } from 'lucide-react';

type ColumnProps = {
  onDelete: (parameterId: string) => void;
  onUpdate: (
    parameterId: string,
    text: string,
    role: string,
    score: number
  ) => void;
};

const getParameterColumns = ({
  onDelete,
  onUpdate,
}: ColumnProps): ColumnDef<Parameters>[] => [
  {
    id: 'text',
    accessorFn: (row) => row?.text,
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
    cell: ({ row }) => (
      <div className="md:w-40 lg:w-60 xl:w-96 truncate">
        {row.original?.text || '-'}
      </div>
    ),
  },
  {
    id: 'role',
    accessorFn: (row) => row?.role,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Role
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original?.role || '-'}</div>,
  },
  {
    id: 'score',
    accessorFn: (row) => row?.score,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-0 hover:bg-transparent"
      >
        Score
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.original?.score;
      return <div>{typeof score === 'number' ? score : '-'}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const parameterId = row.original.id;

      return (
        <ParameterActions
          deleteParameter={async () => onDelete(parameterId)}
          updateParameter={onUpdate}
          parameter={row.original}
        />
      );
    },
  },
];

export default getParameterColumns;
