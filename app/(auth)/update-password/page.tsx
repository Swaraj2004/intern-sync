import UpdatePasswordForm from '@/app/(auth)/update-password/UpdatePasswordForm';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import { getUser } from '@/utils/supabase/auth/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const UpdatePasswordPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const error = searchParams.error;

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Update password link is invalid or has expired.
        </h1>
      </div>
    );
  }

  const user = await getUser();

  if (!user) {
    redirect('/error');
  }

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
          <div className="text-2xl font-medium">Update Password</div>
        </div>
        <UpdatePasswordForm />
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;
