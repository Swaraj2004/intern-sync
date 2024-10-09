import CollegeMentorLoginForm from '@/app/(auth)/login/college-mentor/CollegeMentorLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const CollegeMentorLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="College Mentor Login">
        <CollegeMentorLoginForm />
      </LoginCard>
    </div>
  );
};

export default CollegeMentorLoginPage;
