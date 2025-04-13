import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/Loader';
import { useAddEvaluationStudentResponses } from '@/services/mutations/evaluations';
import { useEvaluationResponses } from '@/services/queries';
import { ClipboardPenIcon } from 'lucide-react';
import { useState } from 'react';

const AddResponsesForm = ({
  mentorEvalId,
  studentId,
}: {
  mentorEvalId: string;
  studentId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const { data: evaluationResponses } = useEvaluationResponses({
    mentorEvaluationId: mentorEvalId,
    studentId: studentId,
    roleFilter: 'student',
  });

  const { addEvaluationResponses } = useAddEvaluationStudentResponses({
    mentorEvaluationId: mentorEvalId,
    studentId: studentId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleFormSubmit = async () => {
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    evaluationResponses?.forEach((res) => {
      const val = formData[res.parameter_id];
      if (!val || val.trim() === '') {
        newErrors[res.parameter_id] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) return;

    addEvaluationResponses(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon-sm">
          <ClipboardPenIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={
          'w-[calc(100vw-24px)] sm:max-w-[550px] max-h-[calc(100vh-24px)] overflow-y-auto'
        }
      >
        <DialogHeader>
          <DialogTitle>Evaluation Form</DialogTitle>
        </DialogHeader>
        <div>
          {evaluationResponses ? (
            evaluationResponses
              .map((res) => res.value)
              .find((val) => val === null) === null ? (
              <>
                <div className="grid w-full gap-5 mb-5 mt-2">
                  {evaluationResponses.map((response) => (
                    <div
                      key={response.parameter_id}
                      className="grid w-full gap-3"
                    >
                      <Label
                        htmlFor={response.parameter_id}
                        className="leading-5"
                      >
                        {response.parameter_text}
                      </Label>
                      <Input
                        id={response.parameter_id}
                        name={response.parameter_id}
                        value={formData[response.parameter_id] || ''}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      {errors[response.parameter_id] && (
                        <p className="text-sm font-medium text-destructive">
                          This field is required.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleFormSubmit}>
                    Submit
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <div className="h-40 flex justify-center items-center">
                <p>Responses already submitted.</p>
              </div>
            )
          ) : (
            <div className="h-40 flex justify-center items-center">
              <Loader />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddResponsesForm;
