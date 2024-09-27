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
import { companyMentorProfileFormSchema } from '@/formSchemas/companyMentorProfile';
import CompanyMentorProfile from '@/types/company-mentor-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UpdateProfileProps = {
  setShowProfileCard: (value: boolean) => void;
  setShowUpdateProfile: (value: boolean) => void;
  updateCompanyMentorProfile: (
    fullName: string,
    contact: number,
    designation: string,
    company_name: string,
    company_address: string
  ) => void;
  profileData: CompanyMentorProfile;
};

const UpdateProfile = ({
  setShowProfileCard,
  setShowUpdateProfile,
  updateCompanyMentorProfile,
  profileData,
}: UpdateProfileProps) => {
  const form = useForm<z.infer<typeof companyMentorProfileFormSchema>>({
    resolver: zodResolver(companyMentorProfileFormSchema),
    defaultValues: {
      fullName: profileData.users?.name || '',
      email: profileData.users?.email || '',
      contact: profileData.users?.contact?.toString() || '',
      designation: profileData.designation || '',
      companyName: profileData.company_name || '',
      companyAddress: profileData.company_address || '',
    },
  });

  const handleUpdateCompanyMentorProfile = async (
    values: z.infer<typeof companyMentorProfileFormSchema>
  ) => {
    const { fullName, designation, companyName, companyAddress } = values;
    const contact = parseInt(values.contact);

    setShowProfileCard(true);
    setShowUpdateProfile(false);

    updateCompanyMentorProfile(
      fullName,
      contact,
      designation,
      companyName,
      companyAddress
    );
  };

  return (
    <Card className="p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateCompanyMentorProfile)}
          className="grid gap-6"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Full Name
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter full name"
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
            name="email"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter email"
                    className="sm:max-w-96"
                    disabled
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
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
            name="designation"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Designation
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter designation"
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
            name="companyName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Company Name
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter company name"
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
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Company Address
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter company address"
                    className="sm:max-w-96"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="sm:col-span-2" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 mt-2">
            <Button type="submit">Save Changes</Button>
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

export default UpdateProfile;
