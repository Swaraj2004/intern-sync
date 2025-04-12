'use client';

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
import { useUser } from '@/context/UserContext';
import MentorEvaluation from '@/types/mentor-evaluations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardPenIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type MentorEvaluationActionsProps = {
  updateEvaluation: (
    evaluationId: string,
    mentorEvaluationId: string,
    evalToggle: boolean,
    evaluatorId: string
  ) => void;
  mentorEvaluation: MentorEvaluation;
  dashboardRole: string;
};

const FormSchema = z.object({
  status: z.string({
    required_error: 'Status is required.',
  }),
  evaluatorId: z.string({
    required_error: 'Evaluator is required.',
  }),
});

export const MentorEvaluationActions: React.FC<
  MentorEvaluationActionsProps
> = ({ updateEvaluation, mentorEvaluation, dashboardRole }) => {
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: mentorEvaluation.eval_toggle ? 'open' : 'closed',
      evaluatorId: mentorEvaluation.evaluator_id,
    },
  });

  const handleUpdateEvaluation = async (data: z.infer<typeof FormSchema>) => {
    setOpenDialog(false);
    const status = data.status === 'open' ? true : false;
    updateEvaluation(
      mentorEvaluation.evaluation_id,
      mentorEvaluation.mentor_evaluation_id,
      status,
      data.evaluatorId
    );
  };

  return (
    <div className="flex justify-end gap-3">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="icon-sm" className="bg-blue-500 hover:bg-blue-600">
            <ClipboardPenIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Add details</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateEvaluation)}
                className="space-y-6 pt-3"
              >
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
    </div>
  );
};
