'use client';

import getEvaluationStudentsColumns from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/evaluationStudentsColumns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/skeleton';
import TableContent from '@/components/ui/TableContent';
import TablePagination from '@/components/ui/TablePagination';
import TableSearch from '@/components/ui/TableSearch';
import { useUser } from '@/context/UserContext';
import {
  useStudentsEvaluations,
  useStudentsForEvaluator,
  useStudentsForMentorEvaluation,
} from '@/services/queries';
import MentorEvaluationStudent from '@/types/mentor-evaluation-students';
import StudentEvaluation from '@/types/student-evaluation';
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import xlsx from 'json-as-xlsx';
import { DownloadIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const EvaluationStudentsTable = ({
  evalToggle,
  mentorEvalId,
  asEvaluator,
}: {
  evalToggle: boolean;
  mentorEvalId: string;
  asEvaluator: boolean;
}) => {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: students, isLoading: isLoadingStudents } =
    useStudentsForMentorEvaluation({
      mentorEvaluationId: mentorEvalId,
    });
  const { data: evaluatorStudents, isLoading: isLoadingEvaluatorStudents } =
    useStudentsForEvaluator({
      evaluatorId: user?.uid!,
    });
  const { data: evaluationData } = useStudentsEvaluations({
    mentorEvaluationId: mentorEvalId,
  });

  const handleGenerateExcel = () => {
    if (evaluationData) {
      const studentsEvaluationData = evaluationData as StudentEvaluation[];
      if (!studentsEvaluationData || studentsEvaluationData.length === 0)
        toast.error('No evaluation data available for the students.');

      const parameterTexts = studentsEvaluationData[0]?.responses.map(
        (r) => r.parameter_text
      );

      const rows = parameterTexts.map((paramText, index) => {
        const row: { [key: string]: any } = {
          'Sr No': `${index + 1}.`,
          'Evaluation Details': paramText,
        };

        studentsEvaluationData.forEach((student) => {
          const response = student.responses.find(
            (r) => r.parameter_text === paramText
          );
          row[student.student_name] = response?.value || '';
        });

        return row;
      });

      // Step 3: Define sheet config
      const data = [
        {
          sheet: 'Evaluation Sheet',
          columns: Object.keys(rows[0]).map((key) => ({
            label: key,
            value: key,
          })),
          content: rows,
        },
      ];

      const settings = {
        fileName: 'Students_Evaluation_Sheet',
        writeMode: 'writeFile',
      };

      const showToast = () => {
        toast.success('Excel file downloaded successfully.');
      };

      xlsx(data, settings, showToast);
    } else {
      toast.error('No evaluation data available for the students.');
    }
  };

  const parameterColumns = useMemo(
    () =>
      getEvaluationStudentsColumns({
        evalToggle: evalToggle,
        asEvaluator: asEvaluator,
        mentorEvalId: mentorEvalId,
      }),
    [evalToggle, asEvaluator, mentorEvalId]
  );

  const tableData = useMemo(
    () =>
      isLoadingStudents && isLoadingEvaluatorStudents
        ? Array(10).fill({})
        : asEvaluator
        ? evaluatorStudents
        : students,
    [
      isLoadingStudents,
      isLoadingEvaluatorStudents,
      students,
      evaluatorStudents,
      asEvaluator,
    ]
  );

  const tableColumns = useMemo(
    () =>
      isLoadingStudents && isLoadingEvaluatorStudents
        ? parameterColumns.map((column, index) => ({
            ...column,
            cell: () => (
              <Skeleton key={`loading-cell-${index}`} className="h-8 rounded" />
            ),
          }))
        : parameterColumns,
    [isLoadingStudents, isLoadingEvaluatorStudents, parameterColumns]
  );

  const table = useReactTable({
    data: tableData as MentorEvaluationStudent[],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="p-5">
      {isLoadingStudents && isLoadingEvaluatorStudents ? (
        <Skeleton className="h-10 max-w-xs rounded-md" />
      ) : (
        mounted && (
          <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col gap-3">
            <TableSearch
              table={table}
              placeholder="Search Name"
              column="name"
            />
            {!asEvaluator && (
              <Button size="sm" onClick={handleGenerateExcel}>
                <DownloadIcon className="w-4 h-4 mr-2" />
                <span className="text-sm">Download XLSX</span>
              </Button>
            )}
          </div>
        )
      )}
      {mounted && (
        <TableContent<MentorEvaluationStudent>
          table={table}
          isLoading={isLoadingStudents && isLoadingEvaluatorStudents}
          mounted={mounted}
          tableData={asEvaluator ? evaluatorStudents : students}
          tableColumns={tableColumns}
        />
      )}
      {(asEvaluator ? evaluatorStudents : students) && (
        <TablePagination table={table} />
      )}
    </Card>
  );
};

export default EvaluationStudentsTable;
