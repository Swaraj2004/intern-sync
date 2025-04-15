import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import { useEvaluationResponses } from '@/services/queries';
import EvaluationResponse from '@/types/evaluation-responses';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollTextIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const StudentEvaluationResponses = ({
  mentorEvalId,
  studentId,
}: {
  mentorEvalId: string;
  studentId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: evaluationResponses, isLoading } = useEvaluationResponses({
    mentorEvaluationId: mentorEvalId,
    studentId: studentId,
  });

  const columns: ColumnDef<EvaluationResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'parameter_text',
        header: 'Evaluation Parameter',
      },
      {
        accessorKey: 'value',
        header: 'Response',
        cell: ({ row }) => <div>{row.original.value || '-'}</div>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: evaluationResponses ?? [],
    columns: isLoading
      ? columns.map((col, idx) => ({
          ...col,
          cell: () => <Skeleton key={idx} className="h-6 rounded" />,
        }))
      : columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm">
          <ScrollTextIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-[calc(100vw-24px)] sm:max-w-[800px] max-h-[calc(100vh-24px)] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Student Evaluation Responses</DialogTitle>
        </DialogHeader>
        {!mounted ? (
          <div className="h-40 flex items-center justify-center">
            <Loader />
          </div>
        ) : evaluationResponses?.length ? (
          <TableContent
            table={table}
            isLoading={isLoading}
            mounted={mounted}
            tableData={evaluationResponses}
            tableColumns={columns}
          />
        ) : (
          <p className="text-muted-foreground text-center py-10">
            No parameters available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentEvaluationResponses;
