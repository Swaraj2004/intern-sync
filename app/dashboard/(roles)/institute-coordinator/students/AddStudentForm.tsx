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
} from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import SearchInput from '@/components/ui/SearchInput';
import SelectInputSkeleton from '@/components/ui/SelectInputSkeleton';
import { useUser } from '@/context/UserContext';
import addStudentFormSchema from '@/formSchemas/addStudent';
import { useAddStudent } from '@/services/mutations/students';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const supabase = supabaseClient();

const AddStudentForm = () => {
  const { user } = useUser();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [collegeMentorId, setCollegeMentorId] = useState<string>('');
  const [collegeMentorName, setCollegeMentorName] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [departmentName, setDepartmentName] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  const instituteId: number = user?.user_metadata.institute_id;
  const userId: string = user?.user_metadata.uid;

  const { data: departmentData } = useQuery(
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

  const { data: mentorsData, isLoading: isMentorsLoading } = useQuery(
    selectedDepartment
      ? supabase
          .from('college_mentors')
          .select('uid, users(id, name)')
          .eq('department_id', selectedDepartment)
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const departments = departmentData
    ? departmentData.map(({ uid, name }) => ({
        value: uid,
        label: name,
      }))
    : [];

  const collegeMentors = mentorsData
    ? mentorsData.map(({ uid, users }) => ({
        value: uid,
        label: (users as { id: string; name: string }).name,
      }))
    : [];

  const form = useForm({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      studentName: '',
      email: '',
      departmentId: '',
      collegeMentorId: '',
      sendInvite: true,
    },
  });

  const { addStudent } = useAddStudent({
    userId,
    instituteId,
  });

  const handleAddStudent = async (
    values: z.infer<typeof addStudentFormSchema>
  ) => {
    const { studentName, email, sendInvite } = values;
    setOpenAddDialog(false);

    await addStudent(
      studentName,
      email,
      departmentId,
      departmentName,
      sendInvite,
      collegeMentorId,
      collegeMentorName
    );
  };

  useEffect(() => {
    form.setValue('collegeMentorId', '');
    setCollegeMentorId('');
    setCollegeMentorName('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

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
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddStudent)}>
            <div className="pb-5 space-y-3">
              <InputBox
                label="Name"
                placeholder="Enter student's full name"
                id="studentName"
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
              {departments.length > 0 && (
                <SearchInput
                  label="Department"
                  placeholder="Select department"
                  id="departmentId"
                  options={departments}
                  form={form}
                  onValueChange={(value) => {
                    setSelectedDepartment(value);
                    const selectedDept = departments.find(
                      (dept) => dept.value === value
                    );
                    setDepartmentId(value);
                    setDepartmentName(selectedDept?.label || '');
                  }}
                />
              )}
              {!selectedDepartment && (
                <SelectInputSkeleton
                  label="College Mentor"
                  placeholder="Select department first"
                />
              )}
              {!mentorsData && selectedDepartment && (
                <SelectInputSkeleton
                  label="College Mentor"
                  placeholder="Loading..."
                />
              )}
              {selectedDepartment &&
                collegeMentors.length === 0 &&
                !isMentorsLoading && (
                  <SelectInputSkeleton
                    label="College Mentor"
                    placeholder="No mentors available"
                  />
                )}
              {selectedDepartment && collegeMentors.length > 0 && (
                <SearchInput
                  label="College Mentor"
                  placeholder="Select college mentor"
                  id="collegeMentorId"
                  options={collegeMentors}
                  form={form}
                  disabled={!selectedDepartment}
                  onValueChange={(value) => {
                    const selectedMentor = collegeMentors.find(
                      (mentor) => mentor.value === value
                    );
                    setCollegeMentorId(value);
                    setCollegeMentorName(selectedMentor?.label || '');
                  }}
                />
              )}
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
                        The student registers via the invite email, which can be
                        sent later too. If the user is already registered, the
                        role is assigned directly without another email.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Student</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentForm;
