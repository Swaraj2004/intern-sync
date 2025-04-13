import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEvaluationResponses } from '@/services/queries';
import { ScrollTextIcon } from 'lucide-react';
import { useState } from 'react';

const StudentEvaluationResponses = ({
  mentorEvalId,
  studentId,
}: {
  mentorEvalId: string;
  studentId: string;
}) => {
  const [open, setOpen] = useState(false);
  const { data: evaluationResponses } = useEvaluationResponses({
    mentorEvaluationId: mentorEvalId,
    studentId: studentId,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm">
          <ScrollTextIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={
          'w-[calc(100vw-24px)] sm:max-w-[800px] max-h-[calc(100vh-24px)] overflow-y-auto'
        }
      >
        <DialogHeader>
          <DialogTitle>Student Evaluation Responses</DialogTitle>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentEvaluationResponses;
