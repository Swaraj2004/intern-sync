import AddEvaluationForm from '@/app/dashboard/(roles)/department-coordinator/evaluations/AddEvaluationForm';
import EvaluationsTable from '@/app/dashboard/(roles)/department-coordinator/evaluations/EvaluationsTable';

const EvaluationsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Evaluations</h1>
        <AddEvaluationForm />
      </div>
      <EvaluationsTable />
    </div>
  );
};

export default EvaluationsPage;
