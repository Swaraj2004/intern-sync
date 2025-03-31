import { useEvaluations } from '@/services/queries';
import Evaluation from '@/types/evaluations';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

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
