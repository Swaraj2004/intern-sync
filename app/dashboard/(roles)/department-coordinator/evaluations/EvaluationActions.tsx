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
import { DateTimePicker } from '@/components/ui/datetime-picker';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import InputBox from '@/components/ui/InputBox';
import { formatDateForInput } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListIcon, Trash2, UserRoundPenIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Evaluation from '@/types/evaluations';

type EvaluationActionsProps = {
  deleteEvaluation: () => Promise<void>;
  updateEvaluation: (evaluationId: string, name: string, date: string) => void;
  evaluation: Evaluation;
  dashboardRole: string;
};

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .min(2, { message: 'Name is required.' }),
  date: z.date({
    required_error: 'Date is required.',
  }),
});

export const EvaluationActions: React.FC<EvaluationActionsProps> = ({
  deleteEvaluation,
  updateEvaluation,
  evaluation,
  dashboardRole,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: evaluation.name,
      date: new Date(evaluation.date),
    },
  });

  const handleUpdateEvaluation = async (data: z.infer<typeof FormSchema>) => {
    setOpenDialog(false);
    updateEvaluation(evaluation.id, data.name, formatDateForInput(data.date));
  };

  return (
    <div className="flex justify-end gap-3">
      <Button size="icon-sm" asChild>
        <Link href={`/dashboard/${dashboardRole}/evaluations/${evaluation.id}`}>
          <ListIcon className="h-5 w-5" />
        </Link>
      </Button>
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
            <DialogTitle>Update Evaluation</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateEvaluation)}
                className="space-y-6 pt-3"
              >
                <InputBox
                  label="Name"
                  placeholder="Enter evaluation name"
                  id="name"
                  type="text"
                  form={form}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="date">Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          jsDate={field.value}
                          onJsDateChange={field.onChange}
                          aria-label="Date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button className="disabled:pointer-events-auto disabled:cursor-not-allowed">
                    Save
                  </Button>
                </DialogFooter>
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
              evaluation and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEvaluation}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
