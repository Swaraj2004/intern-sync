import StudentsTable from '@/app/dashboard/(roles)/college-mentor/students/StudentsTable';

const StudentsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Students</h1>
      </div>
      <StudentsTable />
    </div>
  );
};

export default StudentsPage;
