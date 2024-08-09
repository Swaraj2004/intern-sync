import { Button } from '@/components/ui/button';
import { getUser } from '@/utils/supabase/auth/server';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = supabaseServer();
  const error = searchParams.error;
  const user = await getUser();

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Email verification link is invalid or has expired.
        </h1>
        {!user && (
          <Button variant="link">
            <Link href="/resend-email-verification">
              Resend verification email
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Email verification link is invalid.
        </h1>
      </div>
    );
  }

  const { data: userStatus } = await supabase
    .from('users')
    .select('is_verified')
    .eq('id', user.user_metadata.uid)
    .single();

  if (userStatus?.is_verified) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Your email has already been verified.
        </h1>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (user && !userStatus?.is_verified) {
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
      })
      .eq('id', user.user_metadata.uid);

    if (updateError) {
      console.error(updateError);
    }
  }

  if (user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Your email has been verified.
        </h1>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }
};

export default VerifyEmailPage;
