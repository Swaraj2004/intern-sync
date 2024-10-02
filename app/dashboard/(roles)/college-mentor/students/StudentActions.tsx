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
import { MailPlusIcon } from 'lucide-react';

type StudentActionsProps = {
  sendInvite: () => Promise<void>;
  isVerified: boolean;
};

export const StudentActions: React.FC<StudentActionsProps> = ({
  sendInvite,
  isVerified,
}) => {
  return (
    <div className="flex justify-end gap-3">
      {!isVerified && (
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
