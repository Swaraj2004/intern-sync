'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Loader } from '@/components/ui/Loader';
import SearchInput from '@/components/ui/SearchInput';
import SelectInputSkeleton from '@/components/ui/SelectInputSkeleton';
import { useUser } from '@/context/UserContext';
import { useCollegeMentors } from '@/services/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListIcon, MailPlusIcon, Trash2, UserRoundPenIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type StudentActionsProps = {
  deleteStudent: () => Promise<void>;
  sendInvite: () => Promise<void>;
  changeCollegeMentor: (
    studentId: string,
    mentorId: string,
    mentorName: string
  ) => void;
  studentId: string;
  studentDepartmentId?: string;
  currentMentorId?: string;
  isVerified: boolean;
  dashboardRole: string;
};

const FormSchema = z.object({
  collegeMentorId: z
    .string()
    .min(1, { message: 'Please select a college mentor.' }),
});

export const StudentActions: React.FC<StudentActionsProps> = ({
  deleteStudent,
  sendInvite,
  changeCollegeMentor,
  studentId,
  studentDepartmentId,
  currentMentorId,
  isVerified,
  dashboardRole,
}) => {
  const { instituteId } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMentorName, setSelectedMentorName] = useState<string>('');
  const { data, isLoading: isMentorsLoading } = useCollegeMentors({
    instituteId,
    departmentId: studentDepartmentId,
  });

  const collegeMentors = data
    ? data.map(({ uid, users }) => ({
        value: uid,
        label: (users as { id: string; name: string }).name,
      }))
    : [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      collegeMentorId: currentMentorId || '',
    },
  });

  const handleChangeMentor = async (data: z.infer<typeof FormSchema>) => {
    const selectedMentorId = data.collegeMentorId;
    setOpenDialog(false);
    changeCollegeMentor(studentId, selectedMentorId, selectedMentorName);
  };

  return (
    <div className="flex justify-end gap-3">
      {!isVerified && (
        <>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon-sm"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <MailPlusIcon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send invite email?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will send an invite email to the student.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={sendInvite}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {isVerified && (
        <Button size="icon-sm" asChild>
          <Link href={`/dashboard/${dashboardRole}/students/${studentId}`}>
            <ListIcon className="h-5 w-5" />
          </Link>
        </Button>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="icon-sm" className="bg-green-500 hover:bg-green-600">
            <UserRoundPenIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Assign college mentor</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleChangeMentor)}
                className="space-y-6 pt-3"
              >
                {isMentorsLoading ? (
                  <div className="h-28 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {collegeMentors.length === 0 && (
                      <SelectInputSkeleton
                        label="College Mentor"
                        noLabel
                        placeholder="No mentors available"
                      />
                    )}
                    {collegeMentors && collegeMentors.length > 0 && (
                      <SearchInput
                        label="College Mentor"
                        noLabel
                        id="collegeMentorId"
                        options={collegeMentors}
                        form={form}
                        onValueChange={(value) => {
                          const selectedMentor = collegeMentors.find(
                            (mentor) => mentor.value === value
                          );
                          setSelectedMentorName(selectedMentor?.label || '');
                        }}
                      />
                    )}
                    <DialogFooter>
                      <Button
                        disabled={collegeMentors.length === 0}
                        className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon-sm">
            <Trash2 className="h-4 w-4 dark:text-black" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteStudent}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
