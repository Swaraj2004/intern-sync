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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CircleHelpIcon } from 'lucide-react';
import Link from 'next/link';

type UpdateProfileProps = {
  setShowProfileCard: (value: boolean) => void;
  setShowUpdateProfile: (value: boolean) => void;
  updateCompanyMentorProfile: (
    fullName: string,
    contact: number,
    designation: string,
    company_name: string,
    company_address: string,
    company_latitude: number,
    company_longitude: number,
    company_radius: number
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
      companyCoordinates: profileData.company_latitude
        ? `${profileData.company_latitude}, ${profileData.company_longitude}`
        : '',
      companyRadius: profileData.company_radius?.toString() || '',
    },
  });

  const handleUpdateCompanyMentorProfile = async (
    values: z.infer<typeof companyMentorProfileFormSchema>
  ) => {
    const {
      fullName,
      contact,
      designation,
      companyName,
      companyAddress,
      companyCoordinates,
      companyRadius,
    } = values;
    const [companyLatitude, companyLongitude] = companyCoordinates
      .trim()
      .split(', ')
      .map((c) => +c);

    setShowProfileCard(true);
    setShowUpdateProfile(false);

    updateCompanyMentorProfile(
      fullName.trim(),
      parseInt(contact),
      designation.trim(),
      companyName.trim(),
      companyAddress.trim(),
      companyLatitude,
      companyLongitude,
      parseInt(companyRadius)
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
          <FormField
            control={form.control}
            name="companyCoordinates"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                    Company Coordinates
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger type="button">
                      <CircleHelpIcon className="h-4 w-4 text-muted-foreground" />
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
                        , search for the location, right-click on the spot, and
                        copy the latitude and longitude (Example: 18.92199,
                        72.83457).
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl className="sm:col-span-3">
                  <Input
                    placeholder="Enter company latitude, longitude"
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
            name="companyRadius"
            render={({ field }) => (
              <FormItem className="grid sm:grid-cols-5 sm:space-y-0">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <FormLabel className="sm:col-span-2 font-normal text-base my-auto text-muted-foreground">
                    Company Radius
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger type="button">
                      <CircleHelpIcon className="h-4 w-4 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent side="top" className="max-w-80">
                      <div className="text-sm text-muted-foreground">
                        Enter the radius (in meters) around the selected
                        location to define the area for students to mark
                        attendance.
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl className="sm:col-span-3">
                  <Input
                    type="number"
                    placeholder="Enter company radius (in meters)"
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
