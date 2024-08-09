import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-8 sm:p-10 mx-4 w-fit">
        <Link href="/" className="flex items-center mb-4 justify-center">
          <Logo />
        </Link>
        <div className="text-center">
          <div className="text-2xl font-medium">Welcome back</div>
          <div className="text-sm text-muted-foreground pt-1">
            Glad to see you again. Select your role to login.
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 pt-8">
          <Button
            asChild
            className="px-6 py-3 h-11 rounded-lg w-72 text-lg font-medium dark:text-foreground"
          >
            <Link href="/login/institute-coordinator">
              Institute Coordinator
            </Link>
          </Button>
          <Button
            asChild
            className="px-6 py-3 h-11 rounded-lg w-72 text-lg font-medium dark:text-foreground"
          >
            <Link href="/login/department-coordinator">
              Department Coordinator
            </Link>
          </Button>
          <Button
            asChild
            className="px-6 py-3 h-11 rounded-lg w-72 text-lg font-medium dark:text-foreground"
          >
            <Link href="/login/college-mentor">College Mentor</Link>
          </Button>
          <Button
            asChild
            className="px-6 py-3 h-11 rounded-lg w-72 text-lg font-medium dark:text-foreground"
          >
            <Link href="/login/company-mentor">Company Mentor</Link>
          </Button>
          <Button
            asChild
            className="px-6 py-3 h-11 rounded-lg w-72 text-lg font-medium dark:text-foreground"
          >
            <Link href="/login/student">Student</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
