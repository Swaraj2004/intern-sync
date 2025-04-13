import AddResponsesForm from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/AddResponsesForm';
import StudentEvaluationResponses from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/StudentEvaluationResponses';

export const EvaluationStudentsActions = ({
  evalToggle,
  asEvaluator,
  mentorEvalId,
  studentId,
}: {
  evalToggle: boolean;
  asEvaluator: boolean;
  mentorEvalId: string;
  studentId: string;
}) => {
  return (
    <div className="flex justify-end gap-3">
      {asEvaluator ? (
        evalToggle && (
          <AddResponsesForm mentorEvalId={mentorEvalId} studentId={studentId} />
        )
      ) : (
        <StudentEvaluationResponses
          mentorEvalId={mentorEvalId}
          studentId={studentId}
        />
      )}
    </div>
  );
};
