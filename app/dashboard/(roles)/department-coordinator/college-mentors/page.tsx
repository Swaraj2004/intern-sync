import AddCollegeMentorForm from '@/app/dashboard/(roles)/department-coordinator/college-mentors/AddCollegeMentorForm';
import CollegeMentorsTable from '@/app/dashboard/(roles)/department-coordinator/college-mentors/CollegeMentorsTable';

const CollegeMentorsPage = async () => {
  return (
    <div>
      <div className="flex justify-between items-center pb-5">
        <h1 className="font-semibold text-2xl">College Mentors</h1>
        <AddCollegeMentorForm />
      </div>
      <CollegeMentorsTable />
    </div>
  );
};

export default CollegeMentorsPage;
