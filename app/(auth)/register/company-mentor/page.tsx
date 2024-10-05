import RegistrationForm from '@/app/(auth)/register/company-mentor/RegistrationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';

const RegisterCompanyMentorPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-6 md:p-10 m-4 w-full max-w-md md:max-w-[425px] my-16">
        <CardHeader className="justify-center items-center p-0 pb-6">
          <div className="flex items-center pb-3">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <CardTitle className="text-xl sm:text-2xl text-primary text-center">
            Welcome to InternSync!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RegistrationForm />
          <div className="text-center pt-6">
            Already have an account?{' '}
            <Link
              href={'/login/company-mentor'}
              className="text-primary font-medium"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterCompanyMentorPage;
