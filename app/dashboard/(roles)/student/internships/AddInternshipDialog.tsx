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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import InputBox from '@/components/ui/InputBox';
import SingleSelectInput from '@/components/ui/SelectInput';
import addInternshipFormSchema from '@/formSchemas/addInternship';
import { formatDateForInput } from '@/lib/utils';
import { useAddInternship } from '@/services/mutations/internships';
import StudentInternship from '@/types/student-internship';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import uuid4 from 'uuid4';
import { z } from 'zod';

const modeOptions = [
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Hybrid' },
];

const supabase = supabaseClient();

const AddInternshipDialog = ({
  studentId,
  collegeMentorId,
  internships,
}: {
  studentId: string;
  collegeMentorId: string;
  internships: StudentInternship[];
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addInternship } = useAddInternship({
    studentId,
    collegeMentorId,
  });

  const form = useForm<z.infer<typeof addInternshipFormSchema>>({
    resolver: zodResolver(addInternshipFormSchema),
    defaultValues: {
      role: '',
      field: '',
      mode: '',
      startDate: undefined,
      endDate: undefined,
      companyMentorEmail: '',
      companyName: '',
      companyAddress: '',
      internshipLetter: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof addInternshipFormSchema>) => {
    setLoading(true);

    const conflictingInternship = internships.find((internship) => {
      const existingEndDate = new Date(internship.end_date).getTime();
      const providedStartDate = new Date(values.startDate).getTime();
      return existingEndDate >= providedStartDate;
    });

    if (conflictingInternship) {
      toast.error(
        `Conflicting internship found. The provided start date overlaps with an internship that ends on ${conflictingInternship.end_date}.`
      );
      setLoading(false);
      return;
    }

    const internshipId = uuid4();

    const { data: fileData, error: fileError } = await supabase.storage
      .from('internship-letters')
      .upload(
        `${internshipId}/${values.internshipLetter[0].name}`,
        values.internshipLetter[0]
      );
    console.log(fileData, fileError);

    if (fileError) {
      toast.error(fileError.message);
      return;
    }

    setOpen(false);
    setLoading(false);

    await addInternship({
      id: internshipId,
      role: values.role,
      field: values.field,
      mode: values.mode,
      startDate: formatDateForInput(values.startDate),
      endDate: formatDateForInput(values.endDate),
      companyMentorEmail: values?.companyMentorEmail || null,
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      internshipLetterUrl: fileData.path,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Internship</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-[calc(100vw-24px)] sm:max-w-[450px] md:max-w-[850px] max-h-[calc(100vh-24px)] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Add Internship</DialogTitle>
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
              <SingleSelectInput
                label="Mode of Internship"
                placeholder="Select mode of internship"
                id="mode"
                options={modeOptions}
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
              <FormField
                control={form.control}
                name="internshipLetter"
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    <FormItem className="w-full">
                      <FormLabel>Internship Letter</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple={false}
                          {...rest}
                          onChange={(event) => {
                            onChange(event.target.files);
                          }}
                          className="hover:cursor-pointer"
                        />
                      </FormControl>
                      <FormDescription>
                        Please upload file below 2MB.
                        <br />
                        (.jpg, .jpeg, .png and .pdf files are accepted.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
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

export default AddInternshipDialog;
