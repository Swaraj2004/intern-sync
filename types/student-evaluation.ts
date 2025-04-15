type EvaluationResponse = {
  value: string | null;
  parameter_id: string;
  parameter_text: string;
};

type StudentEvaluation = {
  student_id: string;
  student_name: string;
  responses: EvaluationResponse[];
};

export default StudentEvaluation;
