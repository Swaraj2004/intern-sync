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
import SearchInput from '@/components/ui/SearchInput';
import SingleSelectInput from '@/components/ui/SelectInput';
import { useUser } from '@/context/UserContext';
import MentorEvaluation from '@/types/mentor-evaluations';
import { supabaseClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';
import { PencilIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const supabase = supabaseClient();

const stausOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

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

  const { data: departmentData } = useQuery(
    supabase
      .from('college_mentors')
      .select('department_id')
      .eq('uid', user?.uid!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: mentorsData } = useQuery(
    departmentData && departmentData[0].department_id
      ? supabase
          .from('college_mentors')
          .select('uid, users(id, name)')
          .eq('department_id', departmentData[0].department_id!)
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const collegeMentors = mentorsData
    ? mentorsData.map(({ uid, users }) => ({
        value: uid,
        label: (users as { id: string; name: string }).name,
      }))
    : [];

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
          <Button size="icon-sm" className="bg-green-500 hover:bg-green-600">
            <PencilIcon className="h-4 w-4" />
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
                <SingleSelectInput
                  label="Status"
                  placeholder="Select status"
                  id="status"
                  options={stausOptions}
                  form={form}
                />
                <SearchInput
                  label="Evaluator"
                  placeholder="Select evaluator"
                  id="evaluatorId"
                  options={collegeMentors}
                  form={form}
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
      <Button size="icon-sm" asChild>
        <Link
          href={`/dashboard/${dashboardRole}/evaluations/${mentorEvaluation.mentor_evaluation_id}`}
        >
          <UserIcon className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
};
