import RegistrationForm from '@/app/register-college/RegistrationForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';

const RegisterCollegePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-3 m-4 w-full max-w-md">
        <CardHeader className="justify-center items-center">
          <div className="flex items-center pb-4">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <CardTitle className="text-primary pb-3 text-center">
            Welcome to InternSync!
          </CardTitle>
          <CardDescription className="text-center">
            Register your college to streamline student internship activity
            management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
          <div className="text-center pt-6">
            Already have an account?{' '}
            <Link href={'/login'} className="text-primary font-medium">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterCollegePage;
