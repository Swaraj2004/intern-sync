import InstituteCoordinatorLoginForm from '@/app/login/institute-coordinator/InstituteCoordinatorLoginForm';
import LoginCard from '@/components/ui/LoginCard';

const InstituteCoordinatorLoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoginCard loginType="Institute Coordinator Login">
        <InstituteCoordinatorLoginForm />
      </LoginCard>
    </div>
  );
};

export default InstituteCoordinatorLoginPage;
