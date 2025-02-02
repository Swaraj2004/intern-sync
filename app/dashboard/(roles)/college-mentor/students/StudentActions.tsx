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
import { ListIcon, MailPlusIcon } from 'lucide-react';
import Link from 'next/link';

type StudentActionsProps = {
  sendInvite: () => Promise<void>;
  studentId: string;
  isVerified: boolean;
  dashboardRole: string;
};

export const StudentActions: React.FC<StudentActionsProps> = ({
  sendInvite,
  studentId,
  isVerified,
  dashboardRole,
}) => {
  return (
    <div className="flex justify-end gap-3">
      {isVerified ? (
        <Button size="icon-sm" asChild>
          <Link href={`/dashboard/${dashboardRole}/students/${studentId}`}>
            <ListIcon className="h-5 w-5" />
          </Link>
        </Button>
      ) : (
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
      )}
    </div>
  );
};
