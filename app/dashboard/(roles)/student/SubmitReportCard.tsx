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
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import Attendance from '@/types/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  report: z.string().min(2, 'Report is required.'),
});

type Report =
  | {
      date: string;
      internship_reports: {
        report_data: string | null;
      } | null;
    }
  | null
  | undefined;

const SubmitReportCard = ({
  report,
  attendance,
  isHolidayToday,
  onSubmitReport,
}: {
  report: Report;
  attendance: Attendance | null | undefined;
  isHolidayToday: boolean;
  onSubmitReport: (reportData: string) => Promise<void>;
}) => {
  const [mounted, setMounted] = useState(false);
  const isTextAreaDisabled =
    typeof report?.internship_reports?.report_data === 'string';

  useEffect(() => setMounted(true), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report: report?.internship_reports?.report_data || '',
    },
  });

  const isSubmitDisabled = !form.watch('report');

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    onSubmitReport(values.report);
  };

  return (
    <Card className="flex flex-col flex-grow">
      <CardHeader>
        <CardTitle>Submit Report</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {!isHolidayToday && attendance?.in_time && mounted && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 flex flex-col h-full"
            >
              <FormField
                control={form.control}
                name="report"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Textarea
                        disabled={isTextAreaDisabled}
                        placeholder="Write your report here..."
                        rows={10}
                        className="h-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-right" />
                  </FormItem>
                )}
              />
              <CardFooter className="p-0">
                <Button disabled={isSubmitDisabled || isTextAreaDisabled}>
                  {isTextAreaDisabled ? 'Submitted' : 'Submit'}
                  {/* Submit */}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
        {isHolidayToday && mounted && (
          <div className="text-center p-6 h-full min-h-40 flex rounded-md border border-input bg-background">
            <p className="w-3/4 mx-auto text-muted-foreground pt-12">
              It&apos;s a holiday today. No need to submit a report.
            </p>
          </div>
        )}
        {!isHolidayToday && !attendance?.in_time && mounted && (
          <div className="text-center p-6 h-full min-h-40 flex rounded-md border border-input bg-background">
            <p className="w-3/4 mx-auto text-muted-foreground pt-12">
              You can only submit a report after checking in.
            </p>
          </div>
        )}
        {isHolidayToday && !attendance?.in_time && (
          <CardFooter>
            <Button disabled={true} className="opacity-60">
              Submit
            </Button>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmitReportCard;
