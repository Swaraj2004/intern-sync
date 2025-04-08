'use client';

import EvaluationStudentsTable from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/EvaluationStudentsTable';
import { useEvaluationName } from '@/services/queries';
import { useParams } from 'next/navigation';

const EvaluationStudentsPage = () => {
  const params = useParams();
  const mentorEvalId = params.id as string;

  const { data } = useEvaluationName({
    mentorEvaluationId: mentorEvalId,
  });

  const evaluation = data?.evaluations;

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">
          Evaluation Students {evaluation?.name && `(${evaluation.name})`}
        </h1>
      </div>
      <EvaluationStudentsTable mentorEvalId={mentorEvalId} />
    </div>
  );
};

export default EvaluationStudentsPage;
