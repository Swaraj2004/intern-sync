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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { instituteProfileFormSchema } from '@/formSchemas/instituteProfile';
import InstituteProfile from '@/types/institute-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleHelpIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UpdateProfileProps = {
  setShowProfileCard: (value: boolean) => void;
  setShowUpdateProfile: (value: boolean) => void;
  updateInstituteProfile: (
    fullName: string,
    contact: number | null,
    instituteName: string,
    instituteAddress: string,
    instituteEmailDomain: string,
    studentEmailDomain: string
  ) => void;
  profileData: InstituteProfile;
};

const UpdateProfile = ({
  setShowProfileCard,
  setShowUpdateProfile,
  updateInstituteProfile,
  profileData,
}: UpdateProfileProps) => {
  const form = useForm<z.infer<typeof instituteProfileFormSchema>>({
    resolver: zodResolver(instituteProfileFormSchema),
    defaultValues: {
      fullName: profileData.users?.name || '',
      email: profileData.users?.email || '',
      contact: profileData.users?.contact?.toString() || '',
      instituteName: profileData.name || '',
      instituteAddress: profileData.address || '',
      instituteEmailDomain: profileData.institute_email_domain || '',
      studentEmailDomain: profileData.student_email_domain || '',
    },
  });

  const handleUpdateInstituteProfile = async (
    values: z.infer<typeof instituteProfileFormSchema>
  ) => {
    const {
      fullName,
      instituteName,
      instituteAddress,
      instituteEmailDomain,
      studentEmailDomain,
    } = values;
    const contact = parseInt(values.contact || '') || null;

    setShowProfileCard(true);
    setShowUpdateProfile(false);

    updateInstituteProfile(
      fullName,
      contact,
      instituteName,
      instituteAddress,
      instituteEmailDomain,
      studentEmailDomain
    );
  };

  return (
    <Card className="p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateInstituteProfile)}
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
            name="instituteName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Institute Name
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter institute name"
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
            name="instituteAddress"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Institute Address
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter institute address"
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
            name="instituteEmailDomain"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <FormLabel className="font-normal text-base my-auto text-muted-foreground">
                    Institute Email Domain
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger type="button">
                      <CircleHelpIcon className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-w-80">
                      <div className="text-sm text-muted-foreground">
                        Enter the email domain for institute staff (i.e. the
                        part after the @ in institute emails like example.com)
                        to allow only emails with this ending to be registered
                        as institute staff.
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter institute email domain"
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
            name="studentEmailDomain"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <FormLabel className="font-normal text-base my-auto text-muted-foreground">
                    Student Email Domain
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger type="button">
                      <CircleHelpIcon className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-w-80">
                      <div className="text-sm text-muted-foreground">
                        Enter the student email domain (i.e. the part after the
                        @ in institute emails like example.com) to allow only
                        emails with this ending to be registered as student. If
                        you dont have a seperate domain for students, you can
                        use the same domain as institute email domain.
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter student email domain"
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
