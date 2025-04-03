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
import InputBox from '@/components/ui/InputBox';
import SingleSelectInput from '@/components/ui/SelectInput';
import Parameter from '@/types/parameters';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon, UserRoundPenIcon, FilePenIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'college-mentor', label: 'Evaluator' },
];

type ParameterActionsProps = {
  deleteParameter: () => Promise<void>;
  updateParameter: (
    parameterId: string,
    text: string,
    role: string,
    score: number
  ) => void;
  parameter: Parameter;
};

const FormSchema = z.object({
  name: z
    .string({
      required_error: 'Text is required.',
    })
    .min(2, { message: 'Text must be at least 2 characters.' }),
  role: z.string({
    required_error: 'Role is required.',
  }),
  score: z
    .string({
      required_error: 'Score is required.',
    })
    .min(1, { message: 'Score must be at least 1.' }),
});

export const ParameterActions: React.FC<ParameterActionsProps> = ({
  deleteParameter,
  updateParameter,
  parameter,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: parameter.text,
      role: parameter.role,
      score: `${parameter.score}`,
    },
  });

  const handleUpdateParameter = async (data: z.infer<typeof FormSchema>) => {
    setOpenDialog(false);
    updateParameter(parameter.id, data.name, data.role, parseInt(data.score));
  };

  return (
    <div className="flex justify-end gap-3">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="icon-sm" className="bg-green-500 hover:bg-green-600">
            <FilePenIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Update Parameter</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateParameter)}
                className="space-y-6 pt-3"
              >
                <InputBox
                  label="Name"
                  placeholder="Enter parameter name"
                  id="name"
                  type="text"
                  form={form}
                />
                <SingleSelectInput
                  label="Role"
                  placeholder="Enter parameter role"
                  id="role"
                  options={roleOptions}
                  form={form}
                />
                <InputBox
                  label="Score"
                  placeholder="Enter parameter score"
                  id="score"
                  type="number"
                  form={form}
                />
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon-sm">
            <Trash2Icon className="h-4 w-4 dark:text-black" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              parameter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteParameter}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
