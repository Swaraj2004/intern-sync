import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import Attendance from '@/types/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircleMoreIcon, MessageCircleWarningIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  division: z.string().min(2, '(required)'),
  details: z.string().min(10, '(required)'),
  mainPoints: z.string().min(10, '(required)'),
});

type Report = {
  date: string;
  internship_reports: {
    division: string;
    details: string;
    main_points: string;
    status: string;
    feedback: string | null;
  } | null;
};

const SubmitReportCard = ({
  report,
  attendance,
  isHolidayToday,
  onSubmitReport,
}: {
  report: Report | null | undefined;
  attendance: Attendance | null | undefined;
  isHolidayToday: boolean;
  onSubmitReport: (
    division: string,
    details: string,
    main_points: string
  ) => Promise<void>;
}) => {
  const [mounted, setMounted] = useState(false);
  const isFieldDisabled =
    report?.internship_reports?.status === 'pending' ||
    report?.internship_reports?.status === 'approved';

  useEffect(() => setMounted(true), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      division: report?.internship_reports?.division || '',
      details: report?.internship_reports?.details || '',
      mainPoints: report?.internship_reports?.main_points || '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmitReport(values.division, values.details, values.mainPoints);
  };

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader className="flex-row justify-between items-center flex-wrap gap-4 space-y-0">
        <CardTitle>Daily Report</CardTitle>
        <div className="flex gap-3 items-center">
          {report && report.internship_reports?.status && (
            <>
              {report.internship_reports?.status === 'approved' && (
                <>
                  <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
                    Approved
                  </Badge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon-sm" className="rounded-full">
                        <MessageCircleMoreIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                        <p className="min-h-28 border-2 rounded-lg py-1 px-2">
                          {report.internship_reports?.feedback || 'No feedback'}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
              {report.internship_reports?.status === 'revision' && (
                <>
                  <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-300 dark:hover:bg-orange-400">
                    Revision
                  </Badge>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon-sm" className="rounded-full">
                        <MessageCircleWarningIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-80 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                        <p className="min-h-28 border-2 rounded-lg py-1 px-2">
                          {report.internship_reports?.feedback || 'No feedback'}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
              {report.internship_reports?.status === 'pending' && (
                <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300 text-nowrap">
                  Pending Approval
                </Badge>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-full">
        {!isHolidayToday && attendance?.in_time && mounted && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3 flex flex-col h-full"
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
                        disabled={isFieldDisabled}
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
                        disabled={isFieldDisabled}
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
                name="mainPoints"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-center h-5">
                      <FormLabel>Main points of the day</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Textarea
                        disabled={isFieldDisabled}
                        placeholder="Enter main points of the work assigned today"
                        rows={8}
                        className="max-h-40 resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <CardFooter className="p-0">
                <Button disabled={isFieldDisabled} className="mt-1.5">
                  {isFieldDisabled ? 'Submitted' : 'Submit'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
        {isHolidayToday && mounted && (
          <div className="text-center p-6 h-full min-h-40 flex rounded-md border-2 border-input">
            <p className="w-3/4 mx-auto text-muted-foreground pt-12">
              It&apos;s a holiday today. No need to submit a report.
            </p>
          </div>
        )}
        {!isHolidayToday && !attendance?.in_time && mounted && (
          <div className="text-center p-6 h-full min-h-40 flex rounded-md border-2 border-input">
            <p className="w-3/4 mx-auto text-muted-foreground pt-12">
              You can only submit a report after checking in.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmitReportCard;
