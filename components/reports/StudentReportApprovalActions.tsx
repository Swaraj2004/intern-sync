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
import { InternshipReport } from '@/types/student-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollTextIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import InputBox from '../ui/InputBox';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  feedback: z.string().min(1, 'Feedback is required'),
});

type StudentAttendanceApprovalActionsProps = {
  approveReport: (
    actionType: 'approved' | 'revision',
    attendanceId: string,
    studentId: string,
    status: string
  ) => void;
  internshipReport: InternshipReport | null;
  studentId: string;
  attendanceId: string;
};

const StudentAttendanceApprovalActions = ({
  approveReport,
  internshipReport,
  studentId,
  attendanceId,
}: StudentAttendanceApprovalActionsProps) => {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: internshipReport?.feedback || '',
    },
  });

  const handleApproval = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    if (buttonClicked === 'revision') {
      approveReport('revision', attendanceId, studentId, values.feedback);
    } else if (buttonClicked === 'approve') {
      approveReport('approved', attendanceId, studentId, values.feedback);
    }
  };

  return (
    <div className="flex gap-3 justify-end">
      {internshipReport?.status && (
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
            {(internshipReport.status === 'approved' ||
              internshipReport.status === 'revision') && (
              <dl className="pt-2">
                <dt className="text-sm font-medium mb-2">
                  Department / Division
                </dt>
                <dd className="h-10 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                  {internshipReport.division}
                </dd>
                <dt className="text-sm font-medium mb-2 overflow-y-auto">
                  Details of work assigned
                </dt>
                <dd className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                  {internshipReport.details}
                </dd>
                <dt className="text-sm font-medium mb-2">
                  Main points of the day
                </dt>
                <dd className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm overflow-y-auto">
                  {internshipReport.main_points}
                </dd>
                <dt className="text-sm font-medium mb-2">Feedback</dt>
                <dd className="h-20 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm overflow-y-auto">
                  {internshipReport.feedback}
                </dd>
              </dl>
            )}
            {internshipReport.status === 'pending' && (
              <div>
                <div className="text-sm font-medium mb-2">
                  Department / Division
                </div>
                <div className="h-10 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                  {internshipReport.division}
                </div>
                <div className="text-sm font-medium mb-2 overflow-y-auto">
                  Details of work assigned
                </div>
                <div className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm">
                  {internshipReport.details}
                </div>
                <div className="text-sm font-medium mb-2">
                  Main points of the day
                </div>
                <div className="h-40 md:h-32 w-full rounded-md border-2 border-input bg-transparent px-3 py-2 mb-4 text-sm overflow-y-auto">
                  {internshipReport.main_points}
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleApproval)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter feedback here"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="submit"
                        variant="outline"
                        onClick={() => setButtonClicked('revision')}
                      >
                        Request Revision
                      </Button>
                      <Button
                        type="submit"
                        name="approve"
                        onClick={() => setButtonClicked('approve')}
                      >
                        Approve
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentAttendanceApprovalActions;
