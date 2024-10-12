'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StudentReport from '@/types/student-report';
import StudentsReport from '@/types/students-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollTextIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  division: z.string().min(2, 'Division / Department is required'),
  details: z.string().min(10, 'Details of work assigned is required'),
  main_points: z.string().min(10, 'Main points of the day is required'),
});

type StudentReportApprovalActionProps = {
  updateReport: (
    attendanceId: string,
    division: string,
    details: string,
    main_points: string
  ) => void;
  studentReportData: StudentsReport | StudentReport;
  studentId?: string;
  attendanceId: string;
};

const StudentReportApprovalAction = ({
  updateReport,
  studentReportData,
  studentId,
  attendanceId,
}: StudentReportApprovalActionProps) => {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      division: studentReportData.report_division || '',
      details: studentReportData.report_details || '',
      main_points: studentReportData.report_main_points || '',
    },
  });

  const handleApproval = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    updateReport(
      attendanceId,
      values.division,
      values.details,
      values.main_points
    );
  };

  return (
    studentReportData?.report_status && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            size="icon-sm"
            className="bg-violet-500 hover:bg-violet-600 dark:bg-violet-300 dark:hover:bg-violet-400"
          >
            <ScrollTextIcon className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="w-[calc(100vw-24px)] sm:max-w-[450px] md:max-w-[700px] max-h-[calc(100vh-24px)] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Student Report</DialogTitle>
          </DialogHeader>
          {(studentReportData.report_status === 'approved' ||
            studentReportData.report_status === 'pending') && (
            <dl className="pt-2">
              <dt className="text-sm font-medium mb-2">
                Department / Division
              </dt>
              <dd className="h-10 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                {studentReportData.report_division}
              </dd>
              <dt className="text-sm font-medium mb-2 overflow-y-auto">
                Details of work assigned
              </dt>
              <dd className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                {studentReportData.report_details}
              </dd>
              <dt className="text-sm font-medium mb-2">
                Main points of the day
              </dt>
              <dd className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm overflow-y-auto">
                {studentReportData.report_main_points}
              </dd>
              <dt className="text-sm font-medium mb-2">Feedback</dt>
              <dd className="h-20 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 text-sm overflow-y-auto">
                {studentReportData.report_feedback}
              </dd>
            </dl>
          )}
          {studentReportData.report_status === 'revision' && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleApproval)}
                className="space-y-3 pt-2"
              >
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center h-5">
                        <FormLabel>Department / Division</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter division / department"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center h-5">
                        <FormLabel>Details of work assigned</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Enter details of the work assigned today"
                          rows={8}
                          className="max-h-40 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="main_points"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center h-5">
                        <FormLabel>Main points of the day</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Enter main points of the work assigned today"
                          rows={8}
                          className="max-h-40 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="text-sm font-medium mb-2">Feedback</div>
                <div className="h-20 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm overflow-y-auto">
                  {studentReportData.report_feedback}
                </div>
                <DialogFooter>
                  <Button type="submit">Update</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    )
  );
};

export default StudentReportApprovalAction;
