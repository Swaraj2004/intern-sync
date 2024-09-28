'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { studentProfileFormSchema } from '@/formSchemas/studentProfile';
import StudentProfile from '@/types/student-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { formatDateForInput } from '@/lib/utils';
import { z } from 'zod';

type UpdateStudentProfileProps = {
  setShowProfileCard: (value: boolean) => void;
  setShowUpdateProfile: (value: boolean) => void;
  updateStudentProfile: (
    dob: string | null,
    contact: number,
    address: string,
    admissionYear: number,
    division: string,
    rollNumber: number,
    admissionNumber: string
  ) => void;
  profileData: StudentProfile;
};

const UpdateStudentProfile = ({
  setShowProfileCard,
  setShowUpdateProfile,
  updateStudentProfile,
  profileData,
}: UpdateStudentProfileProps) => {
  const form = useForm<z.infer<typeof studentProfileFormSchema>>({
    resolver: zodResolver(studentProfileFormSchema),
    defaultValues: {
      fullName: profileData.users?.name || '',
      email: profileData.users?.email || '',
      dob: profileData.dob ? new Date(profileData.dob) : undefined,
      contact: profileData.users?.contact?.toString() || '',
      address: profileData.address || '',
      admissionYear: profileData.admission_year?.toString() || '',
      division: profileData.division || '',
      rollNumber: profileData.roll_no?.toString() || '',
      admissionId: profileData.admission_id?.toString() || '',
      departmentName: profileData.departments?.name || '',
      instituteName: profileData.institutes?.name || '',
      collegeMentorName: profileData.college_mentors?.users?.name || '',
    },
  });

  const handleUpdateStudentProfile = async (
    values: z.infer<typeof studentProfileFormSchema>
  ) => {
    const {
      dob,
      contact,
      address,
      admissionYear,
      division,
      rollNumber,
      admissionId,
    } = values;

    setShowProfileCard(true);
    setShowUpdateProfile(false);

    const dateOfBirth = dob ? formatDateForInput(dob) : null;

    updateStudentProfile(
      dateOfBirth,
      parseInt(contact),
      address,
      parseInt(admissionYear),
      division.toLocaleUpperCase(),
      parseInt(rollNumber),
      admissionId
    );
  };

  return (
    <Card className="p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateStudentProfile)}
          className="grid gap-6"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Full Name
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter full name"
                    disabled
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Email
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter email"
                    disabled
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  DOB
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <DateTimePicker
                    jsDate={field.value}
                    onJsDateChange={field.onChange}
                    aria-label="Date of Birth"
                    className="sm:max-w-96"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Contact
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter contact"
                    type="number"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Address
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter address"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionYear"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Admission Year
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter admission year"
                    type="number"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Division
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter division"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Roll Number
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter roll number"
                    type="number"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionId"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Admission ID
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter admission id"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="collegeMentorName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  College Mentor
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input disabled className="sm:max-w-96" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departmentName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Department
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input disabled className="sm:max-w-96" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instituteName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 text-base my-auto">
                  Institute
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input disabled className="sm:max-w-96" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-4 mt-2">
            <Button>Save Changes</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setShowProfileCard(true);
                setShowUpdateProfile(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default UpdateStudentProfile;
