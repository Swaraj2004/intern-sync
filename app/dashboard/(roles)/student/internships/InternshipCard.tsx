import InputBox from '@/components/ui/InputBox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { formatDateForDisplay } from '@/lib/utils';
import StudentInternship from '@/types/student-internship';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  companyMentorEmail: z
    .string()
    .min(1, { message: 'Company mentor email is required.' })
    .email({ message: 'Invalid email address.' }),
});

const supabase = supabaseClient();

const InternshipCard = ({
  internship,
  updateCompanyMentorEmail,
}: {
  internship: StudentInternship;
  updateCompanyMentorEmail: (
    internshipId: string,
    companyMentorEmail: string
  ) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyMentorEmail: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCompanyMentorEmail(internship.id, values.companyMentorEmail);
  };

  const handleViewLetter = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('internship-letters')
      .createSignedUrl(internship.internship_letter_url, 60 * 60);

    setLoading(false);

    if (error) {
      toast.error('Failed to generate signed URL.');
      return;
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  return (
    <Card key={internship.id} className="p-5">
      <div className="flex justify-between flex-wrap gap-x-3 gap-y-2 pb-4">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-200">
          {internship.role}
        </h1>
        {internship.approved ? (
          <Badge className="text-sm h-7 bg-green-500 hover:bg-green-500 dark:bg-green-400 dark:hover:bg-green-400">
            Approved
          </Badge>
        ) : (
          <Badge className="text-sm h-7 bg-yellow-500 hover:bg-yellow-500 dark:bg-yellow-300 dark:hover:bg-yellow-300">
            Approval Pending
          </Badge>
        )}
      </div>
      <div className="pb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pb-1">
          Internship Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Field:</strong> {internship.field}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Mode:</strong>{' '}
          {internship.mode.charAt(0).toUpperCase() + internship.mode.slice(1)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Start Date:</strong>{' '}
          {formatDateForDisplay(internship.start_date)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>End Date:</strong> {formatDateForDisplay(internship.end_date)}
        </p>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pb-1">
          Company Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Company Name:</strong> {internship.company_name}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Company Address:</strong> {internship.company_address}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Company Mentor Email:</strong>{' '}
          {internship.company_mentor_email || 'N/A'}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Internship Letter:</strong>{' '}
          <Button
            onClick={handleViewLetter}
            disabled={loading}
            variant="link"
            className="p-0 h-fit"
          >
            {loading ? 'Generating Link...' : 'View Internship Letter'}
          </Button>
        </p>
      </div>
      {!internship.company_mentor_email && (
        <div className="pt-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Update Internship Details</Button>
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className="w-[calc(100vw-24px)] sm:max-w-[425px]"
            >
              <DialogHeader>
                <DialogTitle>Update Internship Details</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <InputBox
                    label="Company Mentor Email"
                    placeholder="Enter company mentor email"
                    id="companyMentorEmail"
                    type="email"
                    form={form}
                  />
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Card>
  );
};

export default InternshipCard;
