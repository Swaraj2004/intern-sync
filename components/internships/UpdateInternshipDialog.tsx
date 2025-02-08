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
import { Input } from '@/components/ui/input';
import InputBox from '@/components/ui/InputBox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import SingleSelectInput from '@/components/ui/SelectInput';
import updateInternshipFormSchema from '@/formSchemas/updateInternship';
import { formatDateForInput } from '@/lib/utils';
import { useStudentInternships } from '@/services/queries';
import InternshipDetails from '@/types/internship-details';
import { UpdateInternshipParams } from '@/types/internship-mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleHelpIcon } from 'lucide-react';
import Link from 'next/link';
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
  updateInternship,
}: {
  internshipDetails: InternshipDetails;
  internshipId: string;
  updateInternship: ({
    internshipId,
    role,
    field,
    mode,
    startDate,
    endDate,
    companyMentorEmail,
    companyName,
    companyAddress,
    companyLatitude,
    companyLongitude,
    homeLatitude,
    homeLongitude,
  }: UpdateInternshipParams) => Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: internships } = useStudentInternships({
    studentId: internshipDetails.student_uid,
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
      companyCoordinates: internshipDetails.company_latitude
        ? `${internshipDetails.company_latitude}, ${internshipDetails.company_longitude}`
        : '',
      companyRadius: `${internshipDetails.company_radius}`,
      homeCoordinates:
        internshipDetails.student_home_latitude &&
        internshipDetails.student_home_longitude
          ? `${internshipDetails.student_home_latitude}, ${internshipDetails.student_home_longitude}`
          : '',
      homeRadius: `${internshipDetails.student_home_radius}`,
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

    const [homeLatitude, homeLongitude] = values.homeCoordinates
      ? values.homeCoordinates
          .trim()
          .split(',')
          .map((c) => +c.trim())
      : [undefined, undefined];

    const [companyLatitude, companyLongitude] = values.companyCoordinates
      ? values.companyCoordinates
          .trim()
          .split(',')
          .map((c) => +c.trim())
      : [undefined, undefined];

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
        : undefined,
      companyName: values.companyName.trim(),
      companyAddress: values.companyAddress.trim(),
      homeLatitude,
      homeLongitude,
      homeRadius: values.homeRadius ? +values.homeRadius : undefined,
      companyLatitude,
      companyLongitude,
      companyRadius: values.companyRadius ? +values.companyRadius : undefined,
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
              {internshipDetails.mode === 'hybrid' && (
                <>
                  <FormField
                    control={form.control}
                    name="homeCoordinates"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="inline-flex items-center gap-2">
                          <FormLabel>Home Coordinates</FormLabel>
                          <Popover>
                            <PopoverTrigger type="button">
                              <CircleHelpIcon className="h-4 w-4" />
                            </PopoverTrigger>
                            <PopoverContent side="top" className="max-w-80">
                              <div className="text-sm text-muted-foreground">
                                To find coordinates, open{' '}
                                <Link
                                  href="https://www.google.com/maps"
                                  className="text-primary underline"
                                  target="_blank"
                                >
                                  Google Maps
                                </Link>
                                , search for the location, right-click on the
                                spot, and copy the latitude and longitude
                                (Example: 18.92199, 72.83457).
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter home coordinates"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <InputBox
                    label="Home Radius"
                    placeholder="Enter home radius"
                    id="homeRadius"
                    type="number"
                    form={form}
                  />
                </>
              )}
              {internshipDetails.company_mentor_uid && (
                <>
                  <FormField
                    control={form.control}
                    name="companyCoordinates"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="inline-flex items-center gap-2">
                          <FormLabel className="inline-flex items-center">
                            Company Coordinates
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger type="button">
                              <CircleHelpIcon className="h-4 w-4 ml-2" />
                            </PopoverTrigger>
                            <PopoverContent side="top" className="max-w-80">
                              <div className="text-sm text-muted-foreground">
                                To find coordinates, open{' '}
                                <Link
                                  href="https://www.google.com/maps"
                                  className="text-primary underline"
                                  target="_blank"
                                >
                                  Google Maps
                                </Link>
                                , search for the location, right-click on the
                                spot, and copy the latitude and longitude
                                (Example: 18.92199, 72.83457).
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter company coordinates"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <InputBox
                    label="Company Radius"
                    placeholder="Enter company radius"
                    id="companyRadius"
                    type="number"
                    form={form}
                  />
                </>
              )}
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
