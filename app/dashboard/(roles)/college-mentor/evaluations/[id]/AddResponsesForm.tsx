import { Button } from '@/components/ui/button';
import MentorEvaluationStudent from '@/types/mentor-evaluation-students';
import { ClipboardPenIcon } from 'lucide-react';

const AddResponsesForm = ({
  mentorEvaluationStudent,
}: {
  mentorEvaluationStudent: MentorEvaluationStudent;
}) => {
  return (
    <Button size="icon-sm">
      <ClipboardPenIcon className="h-4 w-4" />
    </Button>
  );
};

export default AddResponsesForm;
