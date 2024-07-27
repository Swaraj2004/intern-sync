import CollegeAdminLoginForm from '@/app/login/college-admin/CollegeAdminLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const CollegeAdminLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="College Admin Login">
        <CollegeAdminLoginForm />
      </LoginCard>
    </div>
  );
};

export default CollegeAdminLoginPage;
