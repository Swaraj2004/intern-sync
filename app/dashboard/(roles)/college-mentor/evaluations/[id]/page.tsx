'use client';

import EvaluationStudentsTable from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/EvaluationStudentsTable';
import { Switch } from '@/components/ui/switch';
import { useEvaluationName } from '@/services/queries';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const EvaluationStudentsPage = () => {
  const params = useParams();
  const mentorEvalId = params.id as string;
  const [asEvaluator, setAsEvaluator] = useState(false);

  const { data } = useEvaluationName({
    mentorEvaluationId: mentorEvalId,
  });

  const evaluation = data?.evaluations;

  return (
    <div>
      <div className="flex sm:justify-between sm:items-center pb-5 sm:flex-row flex-col gap-3">
        <h1 className="font-semibold text-2xl">
          Evaluation Students {evaluation?.name && `(${evaluation.name})`}
        </h1>
        <div className="flex gap-3 items-center">
          <h4 className="font-medium">View as Evaluator</h4>
          <Switch
            size="large"
            checked={asEvaluator}
            onClick={() => setAsEvaluator(!asEvaluator)}
          />
        </div>
      </div>
      <EvaluationStudentsTable
        mentorEvalId={mentorEvalId}
        asEvaluator={asEvaluator}
      />
    </div>
  );
};

export default EvaluationStudentsPage;
