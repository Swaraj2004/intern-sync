import {
  useEvaluationResponses,
  useEvaluations,
  useMentorEvaluations,
} from '@/services/queries';
import Evaluation from '@/types/evaluations';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import uuid4 from 'uuid4';

const supabase = supabaseClient();

export const useAddEvaluation = ({
  instituteId,
  departmentId,
}: {
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useEvaluations({
    instituteId: instituteId,
    departmentId: departmentId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addEvaluation = useCallback(
    async (name: string, date: string) => {
      setIsLoading(true);

      const optimisticUpdate: Evaluation = {
        id: crypto.randomUUID(),
        name,
        date,
        institute_id: instituteId,
        department_id: departmentId ?? null,
      };

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: [...currentData.data, optimisticUpdate],
        };
      }, false);

      try {
        const { error } = await supabase.from('evaluations').insert([
          {
            id: optimisticUpdate.id,
            name,
            date,
            institute_id: instituteId,
            department_id: departmentId,
          },
        ]);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Evaluation added successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to add evaluation.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [instituteId, departmentId, mutate]
  );

  return { addEvaluation, isLoading };
};

export const useUpdateEvaluation = ({
  instituteId,
  departmentId,
}: {
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useEvaluations({
    instituteId: instituteId,
    departmentId: departmentId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateEvaluation = useCallback(
    async (evaluationId: string, name: string, date: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.map((evaluation) =>
            evaluation.id === evaluationId
              ? {
                  ...evaluation,
                  name,
                  date,
                }
              : evaluation
          ),
        };
      }, false);

      try {
        const { error } = await supabase
          .from('evaluations')
          .update({ name, date })
          .eq('id', evaluationId);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Evaluation updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to update evaluation.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return { updateEvaluation, isLoading };
};

export const useDeleteEvaluation = ({
  instituteId,
  departmentId,
}: {
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useEvaluations({
    instituteId: instituteId,
    departmentId: departmentId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const deleteEvaluation = useCallback(
    async (evaluationId: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.filter(
            (evaluation) => evaluation.id !== evaluationId
          ),
        };
      }, false);

      try {
        const { error } = await supabase
          .from('evaluations')
          .delete()
          .eq('id', evaluationId);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Evaluation deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to delete evaluation.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return { deleteEvaluation, isLoading };
};

export const useUpdateMentorEvaluation = ({
  mentorId,
}: {
  mentorId: string;
}) => {
  const { mutate } = useMentorEvaluations({
    mentorId: mentorId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateMentorEvaluation = useCallback(
    async (
      evaluationId: string,
      mentorEvaluationId: string,
      evalToggle: boolean,
      evaluatorId: string
    ) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.map((evaluation) =>
            evaluation.evaluation_id === mentorEvaluationId
              ? {
                  ...evaluation,
                  eval_toggle: evalToggle ?? evaluation.eval_toggle,
                  evaluator_id: evaluatorId ?? evaluation.evaluator_id,
                }
              : evaluation
          ),
        };
      }, false);

      try {
        if (mentorEvaluationId !== null) {
          const { error } = await supabase
            .from('mentor_evaluations')
            .update({
              eval_toggle: evalToggle,
              college_mentor_id: mentorId,
              evaluator_id: evaluatorId,
              eval_id: evaluationId,
            })
            .eq('id', mentorEvaluationId);

          if (error) {
            toast.error(error.message);
            return;
          }
        } else {
          const { error } = await supabase.from('mentor_evaluations').insert([
            {
              id: uuid4(),
              eval_toggle: evalToggle,
              college_mentor_id: mentorId,
              evaluator_id: evaluatorId,
              eval_id: evaluationId,
            },
          ]);

          if (error) {
            toast.error(error.message);
            return;
          }
        }

        toast.success('Mentor evaluation updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to update mentor evaluation.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, mentorId]
  );

  return { updateMentorEvaluation, isLoading };
};

export const useAddEvaluationMentorResponses = ({
  mentorEvaluationId,
  studentId,
}: {
  mentorEvaluationId: string;
  studentId: string;
}) => {
  const { mutate } = useEvaluationResponses({
    mentorEvaluationId: mentorEvaluationId,
    studentId: studentId,
    roleFilter: 'college-mentor',
  });
  const [isLoading, setIsLoading] = useState(false);

  const addEvaluationResponses = useCallback(
    async (responses: { [key: string]: string }) => {
      setIsLoading(true);

      try {
        const { error } = await supabase.rpc('insert_evaluation_responses', {
          mentor_eval_id: mentorEvaluationId,
          student_id: studentId,
          response_data: responses,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Responses added successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to add responses.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, mentorEvaluationId, studentId]
  );

  return { addEvaluationResponses, isLoading };
};

export const useAddEvaluationStudentResponses = ({
  mentorEvaluationId,
  studentId,
}: {
  mentorEvaluationId: string;
  studentId: string;
}) => {
  const { mutate } = useEvaluationResponses({
    mentorEvaluationId: mentorEvaluationId,
    studentId: studentId,
    roleFilter: 'student',
  });
  const [isLoading, setIsLoading] = useState(false);

  const addEvaluationResponses = useCallback(
    async (responses: { [key: string]: string }) => {
      setIsLoading(true);

      try {
        const { error } = await supabase.rpc('insert_evaluation_responses', {
          mentor_eval_id: mentorEvaluationId,
          student_id: studentId,
          response_data: responses,
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Responses added successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to add responses.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate, mentorEvaluationId, studentId]
  );

  return { addEvaluationResponses, isLoading };
};
