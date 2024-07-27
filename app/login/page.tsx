import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-8 sm:p-10 md:p-12 m-4 max-w-4xl w-fit md:w-full">
        <div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="hidden md:grid">
              <Image
                src="/login-asset.svg"
                alt="Login"
                width={500}
                height={500}
                className="h-96 w-auto m-auto"
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="pb-4">
                <Link href="/" className="flex items-center">
                  <Logo />
                </Link>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium">Welcome back</div>
                <div className="text-sm text-muted-foreground pt-1">
                  Glad to see you again. Select an option to login.
                </div>
              </div>
              <div className="flex flex-col items-center gap-5 pt-5">
                <Button
                  asChild
                  className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
                >
                  <Link href="/login/college-admin">I am a College Admin</Link>
                </Button>
                <Button
                  asChild
                  className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
                >
                  <Link href="/login/college-mentor">
                    I am a College Mentor
                  </Link>
                </Button>
                <Button
                  asChild
                  className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
                >
                  <Link href="/login/company-mentor">
                    I am a Company Mentor
                  </Link>
                </Button>
                <Button
                  asChild
                  className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
                >
                  <Link href="/login/student">I am a Student</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
