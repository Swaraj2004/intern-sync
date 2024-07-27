import CompanyMentorLoginForm from '@/app/login/company-mentor/CompanyMentorLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const CompanyMentorLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="Company Mentor Login">
        <CompanyMentorLoginForm />
      </LoginCard>
    </div>
  );
};

export default CompanyMentorLoginPage;
