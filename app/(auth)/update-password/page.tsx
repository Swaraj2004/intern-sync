import UpdatePasswordForm from '@/app/(auth)/update-password/UpdatePasswordForm';

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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <UpdatePasswordForm />
    </div>
  );
};

export default UpdatePasswordPage;
