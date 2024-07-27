import StudentLoginForm from '@/app/login/student/StudentLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const StudentLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="Student Login">
        <StudentLoginForm />
      </LoginCard>
    </div>
  );
};

export default StudentLoginPage;
