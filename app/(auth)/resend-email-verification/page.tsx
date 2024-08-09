import EmailVerificationForm from '@/app/(auth)/resend-email-verification/EmailVerificationForm';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';

const ResendEmailVerificationPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-8 mx-4 md:p-10 w-full max-w-96 sm:max-w-md">
        <div className="flex flex-col items-center">
          <Link
            href="/"
            draggable="false"
            className="flex items-center mb-4 justify-center w-fit"
          >
            <Logo className="h-14 w-14" />
          </Link>
          <div className="text-2xl font-medium">Email Verification</div>
        </div>
        <EmailVerificationForm />
      </Card>
    </div>
  );
};

export default ResendEmailVerificationPage;
