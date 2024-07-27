import CollegeMentorLoginForm from '@/app/login/college-mentor/CollegeMentorLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const CollegeMentorLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="Company Mentor Login">
        <CollegeMentorLoginForm />
      </LoginCard>
    </div>
  );
};

export default CollegeMentorLoginPage;
