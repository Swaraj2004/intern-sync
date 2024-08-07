import DepartmentCoordinatorLoginForm from '@/app/(auth)/login/department-coordinator/DepartmentCoordinatorLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const DepartmentCoordinatorLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="Department Coordinator Login">
        <DepartmentCoordinatorLoginForm />
      </LoginCard>
    </div>
  );
};

export default DepartmentCoordinatorLoginPage;
