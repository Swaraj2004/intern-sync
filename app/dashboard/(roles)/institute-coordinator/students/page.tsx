import AddStudentForm from '@/app/dashboard/(roles)/institute-coordinator/students/AddStudentForm';
import StudentsTable from '@/app/dashboard/(roles)/institute-coordinator/students/StudentsTable';

const StudentsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Students</h1>
        <AddStudentForm />
      </div>
      <StudentsTable />
    </div>
  );
};

export default StudentsPage;
