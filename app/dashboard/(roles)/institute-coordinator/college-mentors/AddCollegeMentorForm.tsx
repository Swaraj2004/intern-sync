'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import InputBox from '@/components/ui/InputBox';
import { useRoles } from '@/context/RolesContext';
import { useUser } from '@/context/UserContext';
import addCollegeMentorFormSchema from '@/formSchemas/addCollegeMentor';
import { useAddCollegeMentor } from '@/services/mutations/college-mentors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { supabaseClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import SearchInput from '@/components/ui/SearchInput';

const supabase = supabaseClient();

const AddCollegeMentorForm = () => {
  const { user } = useUser();
  const { roles } = useRoles();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const instituteId: number = user?.user_metadata.institute_id;
  const userId: string = user?.user_metadata.uid;
  const roleId: string = roles?.['college-mentor'] || '';

  const { data } = useQuery(
    instituteId
      ? supabase
          .from('departments')
          .select('uid, name')
          .eq('institute_id', instituteId)
          .order('name', { ascending: true })
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const departments = data
    ? data.map(({ uid, name }) => ({
        value: uid,
        label: name,
      }))
    : null;

  const form = useForm({
    resolver: zodResolver(addCollegeMentorFormSchema),
    defaultValues: {
      collegeMentorName: '',
      email: '',
      departmentId: '',
      contact: undefined,
      dob: undefined,
      sendInvite: true,
    },
  });

  const { addCollegeMentor } = useAddCollegeMentor({
    userId,
    instituteId,
  });

  const handleAddMentor = async (values: any) => {
    const { collegeMentorName, email, departmentId, contact, dob, sendInvite } =
      values;
    setOpenAddDialog(false);

    await addCollegeMentor(
      collegeMentorName,
      email,
      departmentId,
      sendInvite,
      roleId,
      contact,
      dob
    );
  };

  return (
    <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="pr-1">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Add New College Mentor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddMentor)}>
            <div className="pb-5 space-y-3">
              <InputBox
                label="Name"
                placeholder="Enter college mentor's full name"
                id="collegeMentorName"
                type="text"
                form={form}
              />
              <InputBox
                label="Email"
                placeholder="Enter email"
                id="email"
                type="email"
                form={form}
              />
              {departments && (
                <SearchInput
                  label="Department"
                  id="departmentId"
                  options={departments}
                  form={form}
                />
              )}
              {/* {departments && (
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Department</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[200px] justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? departments.find(
                                    (dept) => dept.name === field.value
                                  )?.name
                                : 'Select department'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search department" />
                            <CommandList>
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup>
                                {departments.map((dept) => (
                                  <CommandItem
                                    value={dept.uid}
                                    key={dept.uid}
                                    onSelect={() => {
                                      form.setValue('departmentId', dept.uid);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        dept.name === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {dept.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}
              <FormField
                control={form.control}
                name="sendInvite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send an invite email</FormLabel>
                      <FormDescription>
                        The college mentor registers via the invite email, which
                        can be sent later too. If the user is already
                        registered, the role is assigned directly without
                        another email.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add College Mentor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCollegeMentorForm;
