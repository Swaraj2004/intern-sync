import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
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
import InputBox from '@/components/ui/InputBox';
import SingleSelectInput from '@/components/ui/SelectInput';
import updateInternshipFormSchema from '@/formSchemas/updateInternship';
import { formatDateForInput } from '@/lib/utils';
import { useUpdateInternship } from '@/services/mutations/internships';
import { useStudentInternships } from '@/services/queries';
import InternshipDetails from '@/types/internship-details';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const modeOptions = [
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];

const UpdateInternshipDialog = ({
  internshipDetails,
  internshipId,
}: {
  internshipDetails: InternshipDetails;
  internshipId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: internships } = useStudentInternships({
    studentId: internshipDetails.student_uid,
  });

  const { updateInternship } = useUpdateInternship({
    internshipId,
  });

  const form = useForm<z.infer<typeof updateInternshipFormSchema>>({
    resolver: zodResolver(updateInternshipFormSchema),
    defaultValues: {
      role: internshipDetails.role,
      field: internshipDetails.field,
      mode: internshipDetails.mode,
      startDate: new Date(internshipDetails.start_date),
      endDate: new Date(internshipDetails.end_date),
      companyMentorEmail: internshipDetails.company_mentor_email,
      companyName: internshipDetails.company_name,
      companyAddress: internshipDetails.company_address,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof updateInternshipFormSchema>
  ) => {
    setLoading(true);

    const conflictingInternship = internships?.find((internship) => {
      const existingEndDate = new Date(internship.end_date).getTime();
      const providedStartDate = new Date(values.startDate).getTime();
      return existingEndDate >= providedStartDate;
    });

    if (conflictingInternship && conflictingInternship.id !== internshipId) {
      toast.error(
        `Conflicting internship found. The provided start date overlaps with an internship that ends on ${conflictingInternship.end_date}.`
      );
      setLoading(false);
      return;
    }

    setOpen(false);
    setLoading(false);

    await updateInternship({
      internshipId: internshipId,
      role: values.role.trim(),
      field: values.field.trim(),
      mode: values.mode,
      startDate: formatDateForInput(values.startDate),
      endDate: formatDateForInput(values.endDate),
      companyMentorEmail: values.companyMentorEmail
        ? values?.companyMentorEmail.trim()
        : null,
      companyName: values.companyName.trim(),
      companyAddress: values.companyAddress.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Update Internship</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-[calc(100vw-24px)] sm:max-w-[450px] md:max-w-[850px] max-h-[calc(100vh-24px)] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Update Internship</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-1 mt-2 grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto">
              <InputBox
                label="Role / Position"
                placeholder="Enter role"
                id="role"
                type="text"
                form={form}
              />
              <InputBox
                label="Field / Industry"
                placeholder="Enter field"
                id="field"
                type="text"
                form={form}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="startDate">Start Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                        aria-label="Start Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="endDate">End Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                        aria-label="End Date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SingleSelectInput
                label="Mode of Internship"
                placeholder="Select mode of internship"
                id="mode"
                options={modeOptions}
                form={form}
              />
              <InputBox
                label="Company Mentor Email"
                placeholder="Enter company mentor email"
                id="companyMentorEmail"
                type="email"
                form={form}
              />
              <InputBox
                label="Company Name"
                placeholder="Enter company name"
                id="companyName"
                type="text"
                form={form}
              />
              <InputBox
                label="Company Address"
                placeholder="Enter company address"
                id="companyAddress"
                type="text"
                form={form}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className={`mt-5 ${loading && 'opacity-60 cursor-not-allowed'}`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInternshipDialog;
