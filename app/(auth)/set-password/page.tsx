import SetPasswordForm from '@/app/(auth)/set-password/SetPasswordForm';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import { getUser } from '@/utils/supabase/auth/server';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const SetPasswordPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = supabaseServer();
  const error = searchParams.error;

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Set password link is invalid or has expired.
        </h1>
      </div>
    );
  }

  const user = await getUser();

  if (!user) {
    redirect('/error');
  }

  const { data: userStatus } = await supabase
    .from('users')
    .select('is_verified')
    .eq('id', user.user_metadata.uid)
    .single();

  if (!userStatus?.is_verified) {
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
      })
      .eq('id', user.user_metadata.uid);

    if (updateError) {
      console.error(updateError);
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
            <div className="text-2xl font-medium">Set Password</div>
          </div>
          <SetPasswordForm />
        </Card>
      </div>
    );
  }

  redirect('/error');
};

export default SetPasswordPage;
