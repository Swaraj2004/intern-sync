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
import { departmentProfileFormSchema } from '@/formSchemas/departmentProfile';
import DepartmentProfile from '@/types/department-profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type UpdateProfileProps = {
  setShowProfileCard: (value: boolean) => void;
  setShowUpdateProfile: (value: boolean) => void;
  updateDepartmentProfile: (fullName: string, contact: number) => void;
  profileData: DepartmentProfile;
};

const UpdateProfile = ({
  setShowProfileCard,
  setShowUpdateProfile,
  updateDepartmentProfile,
  profileData,
}: UpdateProfileProps) => {
  const form = useForm<z.infer<typeof departmentProfileFormSchema>>({
    resolver: zodResolver(departmentProfileFormSchema),
    defaultValues: {
      fullName: profileData.users?.name || '',
      email: profileData.users?.email || '',
      contact: profileData.users?.contact?.toString() || '',
      departmentName: profileData.name || '',
      instituteName: profileData.institutes?.name || '',
    },
  });

  const handleUpdateDepartmentProfile = async (
    values: z.infer<typeof departmentProfileFormSchema>
  ) => {
    const { fullName } = values;
    const contact = parseInt(values.contact);

    setShowProfileCard(true);
    setShowUpdateProfile(false);

    updateDepartmentProfile(fullName, contact);
  };

  return (
    <Card className="p-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateDepartmentProfile)}
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
            name="departmentName"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                  Department
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter department name"
                    disabled
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
                  Institute
                </FormLabel>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter institute name"
                    disabled
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
