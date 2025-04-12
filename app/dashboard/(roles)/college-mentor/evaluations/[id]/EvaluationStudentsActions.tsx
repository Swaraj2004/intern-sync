import AddResponsesForm from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/AddResponsesForm';
import StudentEvaluationResponses from '@/app/dashboard/(roles)/college-mentor/evaluations/[id]/StudentEvaluationResponses';
import MentorEvaluationStudent from '@/types/mentor-evaluation-students';

export const EvaluationStudentsActions = ({
  asEvaluator,
  mentorEvaluationStudent,
}: {
  asEvaluator: boolean;
  mentorEvaluationStudent: MentorEvaluationStudent;
}) => {
  return (
    <div className="flex justify-end gap-3">
      {asEvaluator ? (
        <AddResponsesForm mentorEvaluationStudent={mentorEvaluationStudent} />
      ) : (
        <StudentEvaluationResponses />
      )}
    </div>
  );
};
