import { useParametersForEvaluation } from '@/services/queries';
import Parameter from '@/types/parameters';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddParameter = (evalId: string) => {
  const { mutate } = useParametersForEvaluation(evalId);
  const [isLoading, setIsLoading] = useState(false);

  const addParameter = useCallback(
    async (text: string, role: string, score: number) => {
      setIsLoading(true);

      const optimisticUpdate: Parameter = {
        id: crypto.randomUUID(),
        text,
        role,
        score,
        eval_id: evalId,
      };

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: [...currentData.data, optimisticUpdate],
        };
      }, false);

      try {
        const { error } = await supabase.from('parameters').insert([
          {
            id: optimisticUpdate.id,
            text,
            role,
            score,
            eval_id: evalId,
          },
        ]);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Parameter added successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to add parameter.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [evalId, mutate]
  );

  return { addParameter, isLoading };
};

export const useUpdateParameter = (evalId: string) => {
  const { mutate } = useParametersForEvaluation(evalId);
  const [isLoading, setIsLoading] = useState(false);

  const updateParameter = useCallback(
    async (parameterId: string, text: string, role: string, score: number) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.map((parameter) =>
            parameter.id === parameterId
              ? {
                  ...parameter,
                  text,
                  role,
                  score,
                }
              : parameter
          ),
        };
      }, false);

      try {
        const { error } = await supabase
          .from('parameters')
          .update({ text, role, score })
          .eq('id', parameterId);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Parameter updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to update parameter.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return { updateParameter, isLoading };
};

export const useDeleteParameter = (evalId: string) => {
  const { mutate } = useParametersForEvaluation(evalId);
  const [isLoading, setIsLoading] = useState(false);

  const deleteParameter = useCallback(
    async (parameterId: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.filter(
            (parameter) => parameter.id !== parameterId
          ),
        };
      }, false);

      try {
        const { error } = await supabase
          .from('parameters')
          .delete()
          .eq('id', parameterId);

        if (error) {
          toast.error(error.message);
          return;
        }

        toast.success('Parameter deleted successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to delete parameter.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return { deleteParameter, isLoading };
};
