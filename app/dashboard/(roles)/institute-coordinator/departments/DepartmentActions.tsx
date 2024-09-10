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
import { MailPlusIcon, Trash2 } from 'lucide-react';

type DepartmentActionsProps = {
  onDelete: () => Promise<void>;
  onSendInvite: () => Promise<void>;
  isVerified: boolean;
};

export const DepartmentActions: React.FC<DepartmentActionsProps> = ({
  onDelete,
  onSendInvite,
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
                This will send an invite email to the department coordinator.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSendInvite}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
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
              department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
