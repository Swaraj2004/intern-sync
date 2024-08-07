import { Button } from '@/components/ui/button';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = supabaseServer();
  const error = searchParams.error;
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Email verification link is invalid or has expired.
        </h1>
        {!userData && (
          <Button variant="link">
            <Link href="/resend-email-verification">
              Resend verification email
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (userError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium mb-4">
          Email verification link is invalid.
        </h1>
      </div>
    );
  }

  if (userData) {
    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
      })
      .eq('id', userData.user.user_metadata.uid);

    if (updateError) {
      console.error(updateError);
    }
  }

  if (userData) {
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
