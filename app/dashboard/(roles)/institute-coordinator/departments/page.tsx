import AddDepartmentForm from '@/app/dashboard/(roles)/institute-coordinator/departments/AddDepartmentForm';
import DepartmentsTable from '@/app/dashboard/(roles)/institute-coordinator/departments/DepartmentsTable';

const DepartmentsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">Departments</h1>
        <AddDepartmentForm />
      </div>
      <DepartmentsTable />
    </div>
  );
};

export default DepartmentsPage;
