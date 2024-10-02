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
import { CheckIcon, XIcon } from 'lucide-react';

type InternshipApprovalActionsProps = {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
};

const InternshipApprovalActions = ({
  onApprove,
  onReject,
}: InternshipApprovalActionsProps) => {
  return (
    <div className="flex gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-green-500 hover:bg-green-600 h-8 w-8 p-1">
            <CheckIcon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve student internship?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the student&apos;s internship.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onApprove}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon-sm" variant="destructive">
            <XIcon className="h-4 w-4 dark:text-black" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject student internship?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the student&apos;s internship and will remove all
              the associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onReject}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InternshipApprovalActions;
