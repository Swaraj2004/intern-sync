import EvaluationsTable from '@/app/dashboard/(roles)/college-mentor/evaluations/EvaluationTable';

const EvaluationsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Evaluations</h1>
      </div>
      <EvaluationsTable />
    </div>
  );
};

export default EvaluationsPage;
