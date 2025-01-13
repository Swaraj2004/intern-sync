import InternshipsTable from '@/app/dashboard/(roles)/department-coordinator/internships/InternshipsTable';

const InternshipsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Internships</h1>
      </div>
      <InternshipsTable />
    </div>
  );
};

export default InternshipsPage;
