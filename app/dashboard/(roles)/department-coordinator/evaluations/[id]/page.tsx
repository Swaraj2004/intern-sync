'use client';

import AddParameterForm from '@/app/dashboard/(roles)/department-coordinator/evaluations/[id]/AddParametersForm';
import ParametersTable from '@/app/dashboard/(roles)/department-coordinator/evaluations/[id]/ParametersTable';
import { useParams } from 'next/navigation';

const ParametersPage = () => {
  const params = useParams();
  const evalId = params.id as string;

  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Parameters</h1>
        <AddParameterForm evalId={evalId} onParameterAdded={() => {}} />
      </div>
      <ParametersTable evalId={evalId} />
    </div>
  );
};

export default ParametersPage;
