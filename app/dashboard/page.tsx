import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainNav from '@/components/ui/MainNav';
import { convertToTitleCase } from '@/lib/utils';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Roles = { id: string; name: string }[];
type UserRoles = { id: string; path: string; title: string }[];

async function getRoles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/roles`, {
    next: { revalidate: 7 * 60 * 60 * 1000 },
  });

  return res.json();
}

const DashboardRolesPage = async () => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getRoles();
  if (error) return redirect('/error');

  const roles: Roles = data;

  const roleMap =
    roles.reduce((acc, { name, id }) => {
      acc[id] = name;
      return acc;
    }, {} as Record<string, string>) || {};

  if (user?.user_metadata?.role_ids.length === 1) {
    return redirect(`/dashboard/${roleMap[user?.user_metadata?.role_ids[0]]}`);
  }

  const usersRoles: UserRoles = user?.user_metadata?.role_ids.map(
    (role_id: string) => {
      return {
        id: role_id,
        path: `/dashboard/${roleMap[role_id]}`,
        title: convertToTitleCase(roleMap[role_id]),
      };
    }
  );

  return (
    <div>
      <MainNav />
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 sm:p-10 mx-4 w-fit">
          <div className="text-center text-2xl font-medium">Select Role</div>
          <div className="flex flex-col items-center gap-5 pt-6">
            {usersRoles?.map(({ id, path, title }) => (
              <Button
                key={id}
                asChild
                className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
              >
                <Link href={path}>{title}</Link>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardRolesPage;
